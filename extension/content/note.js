GLOBALS_WEB_NOTES.buildNote = function(note,team){
    var thisNote = document.createElement('div');

    thisNote.setAttribute('id',note._id);
    thisNote.setAttribute('data-team-name',team.name);
    thisNote.setAttribute('data-team-id',team._id);
    thisNote.style.padding = "10px";
    thisNote.style.backgroundColor= note.color;
    thisNote.style.left = note.position.x+'px';
    thisNote.style.top = note.position.y+'px';
    thisNote.style.height = note.size.y + 'px';
    thisNote.style.width = note.size.x + 'px';
    thisNote.style.zIndex = 2147483647;//note.position.z+highestZ;
    thisNote.style.position = "absolute";

    $("body").append(thisNote);
    return thisNote;
};

GLOBALS_WEB_NOTES.renderNote = function(note,team)
{
    var self = this;
    var thisNote = this.buildNote(note,team);
    thisNote.innerHTML = note.message?note.message:"";
    thisNote.addEventListener('click',function(){
        self.unrenderNote(note._id);
        self.renderNoteForm(note,team);
    });
};

GLOBALS_WEB_NOTES.renderNoteForm = function(note,team)
{
    var self = this;
    var thisNote = this.buildNote(note,team);
    thisNote.style['box-sizing'] = "border-box";
    var form = document.createElement('form');
    var messageInput= document.createElement('textarea');
    messageInput.setAttribute('rows','10');
    messageInput.style.width='100%';
    messageInput.style.height='134px';
    messageInput.style.resize='none';
    messageInput.style.backgroundColor = thisNote.style.backgroundColor;
    messageInput.style['border-style'] = 'none';
    messageInput.style['box-sizing'] = "border-box";
    messageInput.innerHTML = note.message?note.message:"";
    var teamSelect = document.createElement('select');
    var optionCurrent = document.createElement('option');
    optionCurrent.setAttribute('value',team._id);
    optionCurrent.innerHTML=team.name;
    teamSelect.appendChild(optionCurrent);
    GLOBALS_WEB_NOTES.teamList.forEach(function(teamOp){
        if(teamOp._id===team._id) return;
        var option = document.createElement('option');
        option.setAttribute('value',teamOp._id);
        option.innerHTML = teamOp.name;
        teamSelect.appendChild(option);
    });
    var buttonSave = document.createElement('button');
    buttonSave.style['-webkit-appearance'] = 'push-button';
    buttonSave.setAttribute('type','submit');
    buttonSave.innerHTML='Save';
    form.addEventListener('submit', function(e){
        e.preventDefault();
        self.saveNote(note._id,
            messageInput.value,
            {
                _id: teamSelect.value,
                name:teamSelect.options[teamSelect.selectedIndex].innerHTML
            },
            team);
    });


    var buttonCancel = document.createElement('button');
    buttonCancel.style['-webkit-appearance'] = 'push-button';
    buttonCancel.innerHTML='Cancel';
    buttonCancel.addEventListener('click',function(){
        self.unrenderNote(note._id);
        self.renderNote(note,team);
    },true);
    var buttonDestroy = document.createElement('button');
    buttonDestroy.style['-webkit-appearance'] = 'push-button';
    buttonDestroy.innerHTML='Destroy';
    buttonDestroy.addEventListener('click',function(){
        self.destroyNote(note._id);
    },true);
    form.appendChild(messageInput);
    form.appendChild(teamSelect);
    form.appendChild(buttonSave);
    thisNote.appendChild(buttonCancel);
    thisNote.appendChild(buttonDestroy);


    thisNote.appendChild(form);
};

GLOBALS_WEB_NOTES.unrenderNote = function(noteId){
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