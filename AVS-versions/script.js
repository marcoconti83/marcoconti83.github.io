// An authenticated github instance
var gh;

const GH_ORGANIZATION = 'wireapp';
const GH_WIRE_ROOT = 'https://github.com/wireapp/';

// show an error
function __showError(message, e) {
    var output = "Error: " + (message || "" ) + " " + e
    console.log(output);
    alert(output);
};

$(function(){

    $("#github-auth-form").tabs();
        
    // Show login with password button
    $("#github-login-with-password").show().click(function() {
        $("#github-login-with-password").hide();
        $("#github-login-with-token").hide();
        attemptLoginWithPassword();
    });

    // Show login with token button
    $("#github-login-with-token").show().click(function() {
        $("#github-login-with-password").hide();
        $("#github-login-with-token").hide();
        attemptLoginWithToken();
    });

    // Verify that the given GH instance is authenticated
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

    // Attempt login with provided username/password
    function attemptLoginWithPassword() {
        var tempGH = new GitHub({
            username: $("#github-user").val(),
            password: $("#github-password").val()
        });
        verifyIfAuthSucceded(tempGH);
    }

    // Attempt login with provided token
    function attemptLoginWithToken() {
        var tempGH = new GitHub({
            token: $("#github-token").val()
        });
        verifyIfAuthSucceded(tempGH);
    }

    // Called on successful login
    function loginSuccess(ghInstance) {
        gh = ghInstance;
        $("#github-auth-form").hide();
        $("#github-needs-auth").show();
        $("#github-needs-auth").tabs();
    }
    
});
