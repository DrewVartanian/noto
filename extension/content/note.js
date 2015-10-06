function renderNote(note)
{
    var self = this;

    var thisNote = document.createElement('div');

    thisNote.addEventListener('click', function() { return self.onNoteClick() }, false);

    var edit = document.createElement('div');
    edit.className = 'edit';
    edit.setAttribute('contenteditable', true);
    edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
    thisNote.appendChild(edit);
    thisNote.editField = edit;

    thisNote.style.backgroundColor= note.color;
    thisNote.style.left = note.position.x+'px';
    thisNote.style.top = note.position.y+'px';
    thisNote.style.height = note.size.y + 'px';
    thisNote.style.width = note.size.x + 'px';
    thisNote.style.zIndex = note.position.z;
    thisNote.style.position = "absolute";
    this.note = thisNote;

    $("body").append(thisNote);
    return this;
}

function renderNoteForm(note)
{
    // var self = this;

    var thisNote = document.createElement('div');

    // thisNote.addEventListener('click', function() { return self.onNoteClick() }, false);

    // var edit = document.createElement('div');
    // edit.className = 'edit';
    // edit.setAttribute('contenteditable', true);
    // edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
    // thisNote.appendChild(edit);
    // thisNote.editField = edit;

    thisNote.style.backgroundColor= note.color?note.color:'#FFFF00';
    thisNote.style.left = note.position.x+'px';
    thisNote.style.top = note.position.y+'px';
    thisNote.style.height = (note.size?note.size.y:'200') + 'px';
    thisNote.style.width = (note.size?note.size.x:'200') + 'px';
    thisNote.style.zIndex = note.position.z?note.position.z:100;
    thisNote.style.position = "absolute";
    thisNote.style.padding = "10px";
    thisNote.style['box-sizing'] = "border-box";
    var form = document.createElement('form');
    var messageInput= document.createElement('textarea');
    messageInput.setAttribute('rows','10');
    messageInput.style.width='100%';
    messageInput.style.resize='none';
    messageInput.style.backgroundColor = thisNote.style.backgroundColor;
    messageInput.style['border-style'] = 'none';
    messageInput.style['box-sizing'] = "border-box";
    var buttonSave = document.createElement('button');
    buttonSave.innerHTML='Save';
    var buttonCancel = document.createElement('button');
    buttonCancel.innerHTML='Cancel';
    form.appendChild(messageInput);
    form.appendChild(buttonSave);
    form.appendChild(buttonCancel);
    thisNote.appendChild(form);
    this.note = thisNote;

    $("body").append(thisNote);
    return this;
}

function onNoteClick(e)
{
    // this.editField.focus();
    getSelection().collapseToEnd();
}