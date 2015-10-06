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

function onNoteClick(e)
{
    // this.editField.focus();
    getSelection().collapseToEnd();
}