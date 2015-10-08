  var pages, team;

  chrome.runtime.sendMessage({title: "newPopup"},function(backgroundPages){
    pages=backgroundPages;
    // pages.forEach(function(page){
        //team=page.team._id;
        // page.notes.forEach(function(note){
        //     renderNote(note);
        // });
  	console.log("what are the pages?", pages);
   // });
});

  console.log("what are the pages outside?", pages);