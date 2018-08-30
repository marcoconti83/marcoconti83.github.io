
function getiOSVersions() {

    const IOS_REPO = 'wire-ios';

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

    // Remove previous values
    $("#ios-table > tbody").empty();

    var iOSRepo = gh.getRepo(ghOrganization, IOS_REPO);
    iOSRepo.listTags(function(err, result, req){
        if (err !== null) {
            __showError("fetching tags!", err);
            return;
        }
        
        for (var i=0; i<result.length; i++) {
            var tag = result[i];
            let cellName = "ios-" + tag.commit.sha + "_cell"
            $("#ios-table > tbody:last-child").append(
                "<tr><td>" + 
                "<a href='" + GH_WIRE_ROOT + IOS_REPO + "/tree/" + tag.name + "'>" +
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