function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

$(function(){
    
    var gh;

    $("#github-login-with-password").show().click(function() {
        $("#github-login-with-password").hide();
        $("#github-login-with-token").hide();
        attemptLoginWithPassword();
    });

    $("#github-login-with-token").show().click(function() {
        $("#github-login-with-password").hide();
        $("#github-login-with-token").hide();
        attemptLoginWithToken();
    });

    function verifyIfAuthSucceded(tempGH) {
        tempGH.getUser().getProfile(function(err, result, req){
            if (err !== null) {
                alert("Auth error");
                $("#github-login-with-password").show();
                $("#github-login-with-token").show();
            } else {
                loginSuccess(tempGH);
            }
        });
    };

    function attemptLoginWithPassword() {
        var tempGH = new GitHub({
            username: $("#github-user").val(),
            password: $("#github-password").val()
        });
        verifyIfAuthSucceded(tempGH);
    }

    function attemptLoginWithToken() {
        var tempGH = new GitHub({
            token: $("#github-token").val()
        });
        verifyIfAuthSucceded(tempGH);
    }

    function loginSuccess(ghInstance) {
        gh = ghInstance;
        $("#github-auth-form").hide();
        $("#github-needs-auth").show();
        getiOSVersions();
    }
    
    function findIOSVersion(text) {
        var iOSRegex = /^export APPSTORE_AVS_VERSION=(.*)/;
        var lines = text.split("\n")
        for (var i=0; i<lines.length; i++) {
            var line = lines[i];
            var match = iOSRegex.exec(line)
            if (match !== null) {
                console.log("Found match", match[1]);
                return match[1];
            }
        }
    }

    function getiOSVersions() {
        var iOSRepo = gh.getRepo("wireapp", "wire-ios");
        iOSRepo.listTags(function(err, result, req){
            if (err !== null) {
                alert("Error in fetching tags!\n" + err);
                return;
            }
            $("#ios-fetching-row").remove();
            for (var i=0; i<result.length; i++) {
                var tag = result[i];
                let cellName = "ios-" + tag.commit.sha + "_cell"
                $("#ios-table > tbody:last-child").append(
                    "<tr><td>" + 
                    "<a href='https://github.com/wireapp/wire-ios/tree/" + tag.name + "'>" +
                    tag.name + 
                    "</a>" +
                    "</td>" + 
                    "<td id='" + cellName + "'>Fetching..." + 
                    "</td></tr>"
                );

                iOSRepo.getContents(tag.name, "avs-versions", true, function(err, result, req){
                    if (err !== null) {
                        $("#"+cellName).html("ERROR in fetching");
                        return;
                    }
                    var version = findIOSVersion(result);
                    if (version !== null) {
                        $("#"+cellName).html(version);
                    } else {
                        $("#"+cellName).html("ERROR in parsing");
                    }
                });

                
            }
        });
    }
})
