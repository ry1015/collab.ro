function addSocialNetworkSite(){
    console.log("ADD SOCIAL NETWORK");
    var sn_node = document.getElementById(this.id);
    var sn_index = sn_node.parentNode.parentNode.rowIndex;
    var table = document.getElementById("social_network_table");
    var row = null;
    var sn_link = document.getElementById("add_social_network").value;

    if (sn_link != ""){
        if (sn_index == 0)
            row = table.insertRow(0);
        else
            row = table.insertRow(sn_index);
        
        var cell = row.insertCell(0);
        cell.innerHTML = "<a id=http://" + sn_link+ " href=http://" + sn_link+ " target=_blank>http://" + sn_link + "</a>";
        document.getElementById("add_social_network").value = "";
        cell = row.insertCell(1);
        cell.innerHTML = "<span id=" + sn_link + "_delete class=delete_social_network_site>DELETE</span>";
        deleteSocialNetworkEventListener();
    }
}

function deleteSocialNetworkSite(x){
    console.log("DELETE SOCIAL NETWORK");

    // Delete row from Social Network Table
    var sn_node = document.getElementById(this.id);
    var sn_index = sn_node.parentNode.parentNode.rowIndex;
    var table = document.getElementById("social_network_table");
    table.deleteRow(sn_index);
    
    // Delete User Social Network from Database
    var sn_link = this.id.split("_")[0];

    var deleteUserSocialSite = function(social_network){
        var url = "api/delete-social-network";
        var data = {};
        data["username"] = current_user.user.username;
        data["social_network"] = social_network;
        console.log(data);
        data = JSON.stringify(data);
        deleteRequest(url, data, processDeletedSocialSite);
    }

    var processDeletedSocialSite = function(result){
        console.log("USER'S SOCIAL SITE DELETED!");
        current_user = result;
        console.log("CURRENT USER");
        console.log(current_user);
        // openProfilePage();
    }

    deleteUserSocialSite(sn_link);
}

function updateEvent(){
    console.log("UPDATE BUTTON CLICKED!");
    var password = document.getElementById("Password").value;
    var email = document.getElementById("Email").value;
    var biography = document.getElementById("Biography").value;
    var user_category = document.getElementById("User Category").value;
    
    var phone_number = document.getElementById("Phone").value;
    var address = document.getElementById("Address").value;
    var data = {};

    var updateUserProfile = function(data){
        var url = "api/update-profile";
        var data = JSON.stringify(data);
        console.log(data);
        postRequest(url, data, processUserProfileUpdate); //ajax.js
    }

    var processUserProfileUpdate = function(result){
        console.log("USER PROFILE UPDATE SUCCESSFUL!")
        current_user = result;
        console.log("CURRENT USER");
        console.log(current_user);
        openProfilePage(); //navigation.js
    }

    // USER HAS CHANGED PASSWORD
    if (password.length != 0)
        data["password"] = password;

    var user = {};
    var contact_info = {};
    var profile = {};

    if (current_user.user.email == email)
        email = "";
    
    user["email"] = email;
    user["password"] = password;

    contact_info["address"] = address;
    contact_info["phone_number"] = phone_number;

    profile["biography"] = biography;
    profile["user_category"] = user_category;

    data["user"] = user;
    data["contact_info"] = contact_info;
    data["profile"] = profile;

    data["username"] = current_user.user.username;

    updateUserProfile(data);
}