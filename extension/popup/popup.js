  var pages, teams;

  
  chrome.runtime.sendMessage({title: "newPopup"},function(backgroundPages){
    pages=backgroundPages;
    // pages.forEach(function(page){
        //team=page.team._id;
        // page.notes.forEach(function(note){
        //     renderNote(note);
        // });
    teams=[];
    teams_name = [];
    pages.forEach(function(page){
      // if(!_.contains(teams, page.team)){
        teams.push(page.team);
        teams_name.push(page.team.name);
      // }
    });

    teams = teams.filter(function(team){
      return teams_name.indexOf(team.name) === teams.indexOf(team);
    })
    

    teams.forEach(function(team){
      team.pages = [];
      pages.forEach(function(page){
        if(page.team._id === team._id){
          team.pages.push(page);
        }
      })
    })
    
  	console.log("what are the pages?", pages);
    console.log("what are the teams", teams);
   // });
});

  console.log("what are the pages outside?", pages);