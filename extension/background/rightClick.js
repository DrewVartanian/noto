(function() {
  // create rightclick context menu "Add New Note" option
  GLOBALS.createRightClick = function() {
    // console.log('user',GLOBALS.user.isLoggedIn());
    chrome.contextMenus.removeAll(function() {
      chrome.contextMenus.create({
        "title": "Add New Note",
        "contexts": ["all"],
        "onclick": addNoteOnClickHandler
      });

      chrome.contextMenus.create({
        "type": "separator"
      });

      chrome.contextMenus.create({
        "title": "All Teams",
        "contexts": ["all"],
        "type": "radio",
        "checked": true,
        "onclick": function(info, tab) {
          changeTeamClickHandler(info, tab, 'All Teams');
        }
      });

      chrome.contextMenus.create({
        "title": "personal",
        "contexts": ["all"],
        "type": "radio",
        "checked": false,
        "onclick": function(info, tab) {
          changeTeamClickHandler(info, tab, 'personal');
        }
      });

      GLOBALS.teamsProm.then(function(teams) {
        teams.forEach(function(team) {
          if (team.name === 'personal') return;
          chrome.contextMenus.create({
            "title": team.name,
            "contexts": ["all"],
            "type": "radio",
            "checked": false,
            "onclick": function(info, tab) {
              changeTeamClickHandler(info, tab, team.name);
            }
          });
        });
      });

      function findPageMatch(page, url, team) {
        if (page.url !== url) return false;
        if (team === 'personal' && page.team.name === team) return true;
        return (page.team._id === team);
      }

      // context menu onclick callback function
      function addNoteOnClickHandler(info, tab) {
        chrome.tabs.sendRequest(tab.id, "newNoteClick", function(noteInfo) {
          Promise.resolve($.post(GLOBALS.serverUrl + '/api/note', noteInfo)).then(function(res) {
            GLOBALS.pagesProm.then(function(pages) {
              if (!res.page) {
                pages.some(function(page) {
                  if (findPageMatch(page, noteInfo.url, noteInfo.team)) {
                    page.notes.push(res.note);
                    return true;
                  }
                  return false;
                });
              } else {
                res.page.notes[0] = res.note;
                pages.push(res.page);
              }
              chrome.tabs.sendMessage(tab.id, {
                title: "newNote",
                note: res.note,
                teamId: res.teamId
              });
              return pages;
            });
          }).then(null, function() {});
        });
      }

      function changeTeamClickHandler(info, tab, team) {
        GLOBALS.teamSelected = team;
        chrome.tabs.getAllInWindow(null, function(tabs) {
          for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {
              title: "changeTeam"
            });
          }
        });
      }
    });
  };
})();
