var repositoriesByProject = [
    {
        'project': 'iOS', 
        'repos': [
            'wire-ios', 
            'wire-ios-sync-engine', 
            'wire-ios-ziphy', 
            'wire-ios-transport', 
            'wire-ios-images',
            'wire-ios-cryptobox',
            'wire-ios-utilities',
            'wire-ios-link-preview',
            'wire-ios-data-model',
            'wire-ios-system',
            'wire-ios-mocktransport',
            'wire-ios-testing',
            'wire-ios-protos',
            'wire-ios-share-engine',
            'wire-ios-message-strategy',
            'wire-ios-canvas',
            'wire-ios-request-strategy',
            'wire-ios-shared-resources'
        ]
    },
    {
        'project': 'Android', 
        'repos': [
            'wire-android',
            'wire-android-sync-engine',
            'wire-android-translations',
            'android_test_app',
            'scala-utils'
        ]
    },
    {
        'project': 'Web', 
        'repos': [
            'wire-webapp',
            'wire-desktop',
            'wire-web-packages',
            'webapp-module-namespace',
            'webapp-module-modal',
            'webapp-module-image-rotation',
            'webapp-module-logger',
            'webapp-module-image-compressor',
            'webapp-module-bubble',
            'wire-web-certificate-check',
            'antiscroll-2',
            'libsodium.js',
            'libsodium-neon',
            'wire-webapp-proteus-benchmark',
            'wire-webapp-lru-cache',
            'wire-web-store-engine',
            'wire-web-queue-priority',
            'node-addressbook',
            'cryptobox-bower',
            'cryptobox.js',
            'wire-webapp-cbor',
            'proteus.js',
            'wire-webapp-cryptobox',
            'grunt-npm-bower',
            'babel-plugin-remove-jsx-attributes',
            'bazinga64',
            'wire-theme',
            'neon-gcc'
        ]
    },
    {
        'project': 'Backend', 
        'repos': [
            'wire-server',
            'saml2-web-sso',
            'hscim'
        ]
    },
    {
        'project': 'QA',
        'repos': [
            'wire-web-ets',

        ]
    },
    {
        'project': 'AVS',
        'repos': [
            'restund',
            'wire-audio-video-signaling',
            're'

        ]
    },
    {
        'project': 'Services',
        'repos': [
            'lithium',
            'echo-bot',
            'don-bot',
            'anna-bot',
            'broadcast-bot',
            'alert-bot',
            'bot-sdk-node'
        ]
    }

]

// Calculate values for each repos in a project, in an async fashion
// param: `calculationFunction(repoName, doneCallback)` where `doneCallback(value)`
// param: `doneCallback(finalValue)`
function calculateValuesForRepos(repos, calculationFunction, doneCallback) {

    if (repos.length == 0) {
        doneCallback(0);
    }

    var accumulatedValues = [];
    // for each repo
    for(var i=0; i < repos.length; ++i) {

        // run async function
        calculationFunction(repos[i], function(v) {
            // store result
            accumulatedValues.push(v);
            // when I have results for all repos
            if (accumulatedValues.length == repos.length) {
                var sum = 0;
                // compute total sum
                for(var j=0; j < accumulatedValues.length; ++j) {
                    sum += accumulatedValues[j];
                }
                doneCallback(sum);
            }
        });
    }
}

// Calculate values for each project, in an async fashion
// param: `calculationFunction(repoName, doneCallback)` where `doneCallback(value)`
// param: `doneCallback(finalValue)`
function calculateValuesForAllProjects(label, table, projects, calculationFunction, doneCallback) {

    var line = $('<tr/>');
    line.append("<th>" + label + "</th>");
    table.append(line);

    // track which ones still pending
    var projectsToCalculate = projects.slice();

    function calculateForFirstProject(projects, calculationFunction, done) {
        if (projects.length == 0) {
            done();
            return;
        }
        var project = projects.shift();
        calculateValuesForRepos(project.repos, calculationFunction, function(v) {
            line.append("<td>" + v + "</td>");
            calculateForFirstProject(projects, calculationFunction, done);
        });
    }

    calculateForFirstProject(projectsToCalculate, calculationFunction, doneCallback);
};

// Get the activity on GitHub
function getActivityData() {
    __buildRepositioriesList();

};

function __buildRepositioriesList() {

    var allKnownRepos = new Set();

    for(var i=0; i<repositoriesByProject.length; ++i) {
        for(var j=0; j<repositoriesByProject[i].repos.length; ++j) {
            allKnownRepos.add(repositoriesByProject[i].repos[j]);
        }
    }

    gh.getOrganization(GH_ORGANIZATION).getRepos().then(function(resp){
        var unclassified = [];
        var sourceRepos = resp.data.filter(function(r) { return r.fork == false; });
        for(var i=0; i<sourceRepos.length; ++i) {
            var repo = sourceRepos[i];
            if (!allKnownRepos.has(repo.name)) {
                unclassified.push(repo.name);
            }
        }
        return unclassified;
    }).then (function(repos){
        repositoriesByProject.push({"project": "Others", "repos": repos});
        __fetchProjectsData();
    });
}

function __fetchProjectsData() {
    
    var container = $("#tab-activity > div")
    container.empty();

    var table = $('<table><thead></thead><tbody></tbody></table>');
    var tbody = $('tbody', table);
    container.append(table);
    var header = $('<tr/>');
    header.append("<th>&nbsp;</th>");
    $('thead',table).append(header);

    for(var i=0; i<repositoriesByProject.length; ++i) {
        var project = repositoriesByProject[i];
        var ulist = $("<ul/>")
        for(var j=0; j<project.repos.length; ++j) {
            repo = project.repos[j];
            ulist.append("<li><a href='" + GH_WIRE_ROOT + repo + "'>" + repo + "</a></li>");
        }
        var details = $("<details/>");
        details.append("<summary>" + project.project + "</summary>");
        details.append(ulist);
        header.append($("<th/>").append(details));    
    }

    calculateValuesForAllProjects("🗄 Repositories", tbody, repositoriesByProject, function(name, done) {
        done(1);
    }, function() {});

    calculateValuesForAllProjects("⭐️ Stars", tbody, repositoriesByProject, function(name, done) {
        gh.getRepo(GH_ORGANIZATION, name).getDetails(function(err, result, req) {
            if (err !== null) {
                console.log("Error: "+ err);
                done(0);
                return;
            }
            done(result.stargazers_count);
        });
    }, function() {});
}