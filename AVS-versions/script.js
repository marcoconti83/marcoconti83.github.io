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

function forget() {
    localStorage.gh_token = null;
    $("#github-token").val("");
    $("#github-remember-token").prop('checked', false);
}

$(function(){

    $("#github-auth-form").tabs();

    // load local storage token
    if (localStorage.gh_token != null && localStorage.gh_token.length > 0) {
        $("#github-token").val(localStorage.gh_token);
    }
        
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
    function verifyIfAuthSucceded(tempGH, token) {
        tempGH.getUser().getProfile(function(err, result, req){
            if (err !== null) {
                alert("Auth error");
                $("#github-login-with-password").show();
                $("#github-login-with-token").show();
            } else {
                localStorage.gh_token = token;
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
        token = $("#github-token").val()
        var tempGH = new GitHub({
            token: token
        });
        if ($("#github-remember-token").prop('checked')) {
            verifyIfAuthSucceded(tempGH, token);
        } else {
            verifyIfAuthSucceded(tempGH, null);
        }
        
    }

    // Called on successful login
    function loginSuccess(ghInstance) {
        gh = ghInstance;
        $("#github-auth-form").hide();
        $("#github-needs-auth").show();
        $("#github-needs-auth").tabs();
    }
    
});
