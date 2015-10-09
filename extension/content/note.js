GLOBALS_WEB_NOTES.buildNote = function(note,team){
    var $thisNote = $('<div></div>');
    $thisNote.draggable({
        
    });

    $thisNote.attr({
        'id': note._id,
        'data-team-name': team.name,
        'data-team-id': team._id
    });


    $thisNote.css({
        'padding': '10px',
        'background-color': note.color,
        'left': note.position.x+'px',
        'top': note.position.y+'px',
        'height': note.size.y+'px',
        'width': note.size.x + 'px',
        'zIndex': 2147483647,
        'position': "absolute",
        'box-sizing': "border-box"
    });

    $('body').append($thisNote);
    return $thisNote;
};

GLOBALS_WEB_NOTES.renderNote = function(note,team)
{
    var self = this;
    var $thisNote = this.buildNote(note,team);
    var message = note.message ? note.message : "";
    $thisNote.html(message);
    $thisNote.click(function(){
        console.log("clicked renderNote");
        $('#'+note._id).draggable();
        self.unrenderNote(note._id);
        self.renderNoteForm(note,team);
    });
};

GLOBALS_WEB_NOTES.renderNoteForm = function(note,team)
{
    console.log("renderNoteForm");
    var self = this;
    var $thisNote = this.buildNote(note,team);
    var $form = $('<form></form>');
    var $messageInput = $('<textarea></textarea>');
    $messageInput.attr('rows','10');
    $messageInput.css({
        'width': '100%',
        'height': '134px',
        'resize': 'none',
        'backgroundColor': $thisNote.css('backgroundColor'),
        'border-style': 'none',
        'box-sizing': "border-box",
    });
    
    var message = note.message ? note.message : "";
    $messageInput.html(message);
    var $teamSelect = $('<select></select>');
    $teamSelect.attr("id", "selectTeam");
    var $optionCurrent = $('<option></option>');
    $optionCurrent.attr('value', team._id);
    $optionCurrent.html(team.name);
    $teamSelect.append($optionCurrent);
    GLOBALS_WEB_NOTES.teamList.forEach(function(teamOp){
        if(teamOp._id===team._id) return;
        var $option = $('<option></option>');
        $option.attr('value', teamOp._id);
        $option.html(teamOp.name);
        $teamSelect.append($option);
    });

    var $buttonSave = $('<button></button>');
    $buttonSave.css('-webkit-appearance', 'push-button');
    $buttonSave.attr('type', 'submit');
    $buttonSave.text('Save');
    $form.submit(function(e){
        e.preventDefault();
        self.saveNote(note._id,
            $messageInput.html(),
            {
                _id: $teamSelect.val(),
                // to debug
                name: $("#selectTeam option:selected").html()
            },
            team);
    });

//$teamSelect.option($teamSelect.selectedIndex).html()


    var $buttonCancel = $('<button></button>');
    $buttonCancel.css('-webkit-appearance','push-$button');
    $buttonCancel.html('Cancel');
    $buttonCancel.click(function(){
        self.unrenderNote(note._id);
        self.renderNote(note,team);
    });
    var $buttonDestroy = $('<button></button>');
    $buttonDestroy.css('-webkit-appearance','push-$button');
    $buttonDestroy.html('Destroy');
    $buttonDestroy.click(function(){
        self.destroyNote(note._id);
    });
    $form.append($messageInput);
    $form.append($teamSelect);
    $form.append($buttonSave);
    $thisNote.append($buttonCancel);
    $thisNote.append($buttonDestroy);


    $thisNote.append($form);
};

GLOBALS_WEB_NOTES.unrenderNote = function(noteId){
    console.log("unrenderNote");

    $('#'+noteId).remove();
};

GLOBALS_WEB_NOTES.destroyNote = function(noteId){
    var self = this;
    chrome.runtime.sendMessage({title: "destroyNote",noteId: noteId},function(confirmation){
        if(confirmation==='deleted'){
            self.unrenderNote(noteId);
        }
    });
};


GLOBALS_WEB_NOTES.saveNote = function(noteId, message, newTeam, oldTeam){
    var self = this;
    chrome.runtime.sendMessage({
        title: "saveNote",
        noteId: noteId,
        message: message,
        newTeam: newTeam._id,
        oldTeam: oldTeam._id
    },function(changedNote){
        self.unrenderNote(noteId);
        self.renderNote(changedNote,newTeam);
    });
};