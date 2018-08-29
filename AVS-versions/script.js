function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
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

$(function(){
    const gh = new GitHub();
    var iOSRepo = gh.getRepo("wireapp", "wire-ios");
    iOSRepo.listTags(function(err, result, req){
        if (err !== null) {
            alert("Error in fetching tags!");
            return;
        }
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
})
