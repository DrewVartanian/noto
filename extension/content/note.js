function renderNote(note)
{
    var thisNote = buildNote(note);
    thisNote.innerHTML = note.message?note.message:"";
    thisNote.addEventListener('click',function(){
        unrenderNote(note._id);
        renderNoteForm(note);
    });
}

function buildNote(note){
    var thisNote = document.createElement('div');

    thisNote.setAttribute('id',note._id);
    thisNote.style.padding = "10px";
    thisNote.style.backgroundColor= note.color;
    thisNote.style.left = note.position.x+'px';
    thisNote.style.top = note.position.y+'px';
    thisNote.style.height = note.size.y + 'px';
    thisNote.style.width = note.size.x + 'px';
    thisNote.style.zIndex = note.position.z;
    thisNote.style.position = "absolute";

    $("body").append(thisNote);
    return thisNote;
}

function renderNoteForm(note)
{
    var thisNote = buildNote(note);
    thisNote.style['box-sizing'] = "border-box";
    var form = document.createElement('form');
    var messageInput= document.createElement('textarea');
    messageInput.setAttribute('rows','10');
    messageInput.style.width='100%';
    messageInput.style.resize='none';
    messageInput.style.backgroundColor = thisNote.style.backgroundColor;
    messageInput.style['border-style'] = 'none';
    messageInput.style['box-sizing'] = "border-box";
    messageInput.innerHTML = note.message?note.message:"";
    var buttonSave = document.createElement('button');
    buttonSave.setAttribute('type','submit');
    buttonSave.innerHTML='Save';
    form.addEventListener('submit', function(e){
        e.preventDefault();
        saveNote(note._id, messageInput.value);

    });


    var buttonCancel = document.createElement('button');
    buttonCancel.innerHTML='Cancel';
    buttonCancel.addEventListener('click',function(){
        unrenderNote(note._id);
        renderNote(note);
    },true);
    var buttonDestroy = document.createElement('button');
    buttonDestroy.innerHTML='Destroy';
    buttonDestroy.addEventListener('click',function(){
        destroyNote(note._id);
        // unrenderNote(note._id);
    },true);
    form.appendChild(messageInput);
    form.appendChild(buttonSave);
    thisNote.appendChild(buttonCancel);
    thisNote.appendChild(buttonDestroy);


    thisNote.appendChild(form);
}

function unrenderNote(noteId){
    $('#'+noteId).remove();
}

function destroyNote(noteId){
    chrome.runtime.sendMessage({title: "destroyNote",noteId: noteId},function(confirmation){
        if(confirmation==='deleted'){
            unrenderNote(noteId);
        }
    });
}


function saveNote(noteId, message){
    chrome.runtime.sendMessage({title: "saveNote", noteId: noteId, message: message},function(changedNote){
        unrenderNote(noteId);
        renderNote(changedNote);
    });
}