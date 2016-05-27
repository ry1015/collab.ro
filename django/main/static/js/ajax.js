var home = "http://127.0.0.1:8000/";
function failCallback(result){
    console.log(result.responseText);
}

function getRequest(url, data, callback){
    $.getJSON({
        url: home + url,
        data: data,
        success : function (result) { 
            callback(result);
        },
        error : function(result){
            failCallback(result);
        }
    });
}

function postRequest(url, data, callback){
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success : function (result){
            callback(result);
        },
        error : function(result){
            failCallback(result);
        }
    });
}