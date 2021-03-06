from django.shortcuts import render, render_to_response
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from main.serializer import UserSerializer, UserProfileSerializer, ContactInformationSerializer, TrackCommentSerializer
from main.models import UserProfile, UserCategory, SocialNetwork, ContactInformation, Music, TrackComment
import json
from startup.settings import MEDIA_ROOT
import os
import pprint

# Gets all track comments
@api_view(['GET'])
def get_track_comments(request, format=None):
    print ("------------------------------------------------------------")
    print ("START GET TRACK COMMENTS")
    selected_track = request.GET.get("filename")

    track_num, username, track_name = selected_track.split("_")
    comments = []

    # Get User
    try:
        user = User.objects.get(username=username)
    except:
        Response("User Does Not Exist", status=status.HTTP_400_BAD_REQUEST)

    # Get Music
    try:
        music = Music.objects.get(userID=user, filename=selected_track)
    except:
        Response("No Music Exists.", status=status.HTTP_400_BAD_REQUEST)

    # Get Track Comments
    try:
        comments = TrackComment.objects.filter(musicID=music).order_by('-timestamp')
    except:
        Response("No Track Comments.", status=status.HTTP_400_BAD_REQUEST)

    data = []
    if (len(comments) > 0):
        # Grab all parents
        for comment in comments:
            parent = {}
            if(comment.comment_parent_id == None):
                parent = TrackCommentSerializer(comment).data
                parent["sender"] = User.objects.get(id=parent["sender"]).username
                parent["id"] = comment.id
                parent["child"] = []
                data.append(parent)

        for parent in data:
            for comment in comments:
                if (comment.comment_parent_id != None and comment.comment_parent_id == parent["id"]):
                    child_data = TrackCommentSerializer(comment).data
                    child_data["sender"] = User.objects.get(id=comment.sender.id).username
                    parent["child"].append(child_data)
    else:
        print ("NO COMMENTS")
    data.append({"filename": selected_track})
    print ("END GET TRACK COMMENTS")
    print ("------------------------------------------------------------")
    return Response(data, status=status.HTTP_200_OK)

# Store reply
@api_view(['POST'])
def post_reply(request, format=None):
    if request.user.is_authenticated:
        pass
    else:
        request.session.flush()
        return Response("User not Authenticated.")

    print ("------------------------------------------------------------")
    print ("START POST REPLY")
    try:
        user = User.objects.get(username=request.POST.get("username"))
    except:
        return Response("USER INVALID", status=status.HTTP_400_BAD_REQUEST)

    try:
        music = Music.objects.get(filename=request.POST.get("track_filename"))
    except:
        return Response("MUSIC INVALID", status=status.HTTP_400_BAD_REQUEST)

    data = {}
    data["musicID"] = music.id
    data["comments"] = request.POST.get("comment")
    data["sender"] = user.id
    data["comment_parent_id"] = request.POST.get("parent")
    pprint.pprint(data)
    serializer = TrackCommentSerializer(data=data)
    print ("END POST REPLY")
    print ("------------------------------------------------------------")
    if serializer.is_valid():
        serializer.save()
        return Response("SUCCESS", status=status.HTTP_200_OK)
    else:
        return Response("SERIALIZER INVALID", status=status.HTTP_400_BAD_REQUEST)
    

# Store track comments
@api_view(['POST'])
def post_track_comment(request, format=None):
    if request.user.is_authenticated:
        pass
    else:
        request.session.flush()
        return Response("User not Authenticated.")

    username = request.POST.get("username")
    comment = request.POST.get("comment")
    track_filename = request.POST.get("track_filename")

    try:
        user = User.objects.get(username=username)
    except:
        print("COULD NOT FIND USER")
        return Response("COULD NOT FIND USER", status=status.HTTP_400_BAD_REQUEST)

    try:
        music = Music.objects.get(filename=track_filename)
    except:
        print("COULD NOT FIND MUSIC")
        return Response("COULD NOT FIND MUSIC", status=status.HTTP_400_BAD_REQUEST)

    try:
        track_comment = TrackComment.objects.create(musicID=music, comments=comment, sender=user)
    except:
        print("COULD NOT CREATE TRACK COMMENT")
        return Response("COULD NOT CREATE TRACK COMMENT", status=status.HTTP_400_BAD_REQUEST)
    data = {}
    data["cid"] = track_comment.id
    return Response(data, status=status.HTTP_200_OK)