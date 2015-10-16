GLOBALS_WEB_NOTES.buildNote = function(note,team){
    var self = this;
    var $thisNote = $('<div></div>');

    var colors = ['yellow','red', 'pink', 'white', 'green', 'blue', 'orange', 'purple'];
    $thisNote.attr({
        // 'class': 'webnote',
        'id': note._id,
        'data-team-name': team.name,
        'data-team-id': team._id,
        'color': colors
    });
    $thisNote.addClass( "web-notes-id-class" );

    $thisNote.css({
        'padding': '10px',
        'background-color': note.color,
        'left': note.position.x*$(document).width()/100+'px',
        'top': note.position.y+'px',
        'height': note.size.y+'px',
        'width': note.size.x + 'px',
        'zIndex': 2147483647,
        'position': 'absolute',
        'box-sizing': "border-box",
        'font-family': 'Gloria Hallelujah',
        'font-size': '15px',
         // '-moz-transform': 'rotate(4deg)',
         //  '-webkit-transform': 'rotate(4deg)',
         // '-o-transform': 'rotate(4deg)',
         // '-ms-transform': 'rotate(4deg)',
         //  'transform': 'rotate(4deg)',
        'box-shadow': '0px 4px 6px #333',
        '-moz-box-shadow': '0px 4px 6px #333',
        '-webkit-box-shadow': '0px 4px 6px #333',
        'opacity': '0.8',
        'white-space': 'pre-wrap',
        'word-wrap': 'break-word'
    });


    $thisNote.draggable({
        cursor: 'move',
        stop: function() {
            // console.log("drag stop, note: ", note,"self: ", self);
            note.position.x = 100*$(this).position().left/$(document).width();
            note.position.y = $(this).position().top;
            self.saveNotePosition(note, team);
        }
    });
        //type: 'rotation',
         //revert: true
        // drag: function(event, ui){
        // var rotateCSS = 'rotate(' + ui.position.left + 'deg)';

        // $(this).css({
        //  '-moz-transform': rotateCSS,
        // '-webkit-transform': rotateCSS
        // });

//     iconURL = chrome.extension.getURL("/icons/rotate-symbol.png");

//     var $rotateSym = $('<div></div>');
//     $rotateSym.appendTo($thisNote).attr('id','handle').css({
//     //'position': 'absolute',
//     'height': 16,
//     'width': 16,
//     'cursor': 'pointer',
//     'left': 2 + 'px',
//     'bottom': 2 + 'px',
//     'background-image': `url("${iconURL}")`
//     });

//     $rotateSym.draggable({
//     handle: '#handle',
//     opacity: 0.01,
//      helper: 'clone',
//     drag: function(event, ui){
//         var rotateCSS = 'rotate' + ui.position.left + 'deg)';
//         $(this).parent().css({
//             '-moz-transform': rotateCSS,
//             '-webkit-transform': rotateCSS
//         });
//     }
// });

    $thisNote.resizable({
        minWidth: 200,
        minHeight: 200,
        // handles: 'se'
        //alsoResize: "#noteform"
    });

    // var resizeIcon = chrome.extension.getURL("/icons/resize.png");
    // var $buttonResize = $('<div></div>');
    // $buttonResize.addClass('ui-resizable-handle ui-resizable-se');
    // $buttonResize.css({
    //     'height': '30px',
    //     'width': '30px',
    //     'cursor': 'se-resize',
    //     'background': 'url('+resizeIcon+')',
    //     'position': 'absolute',
    //     'right': '-15px',
    //     'bottom': '-15px',
    //     // 'display': 'none'
    // });
    // $thisNote.hover(function() {
    //     $buttonResize.css({'display': 'block'});
    // }, function() {
    //     $buttonResize.css({'display': 'none'});
    // });
    // $thisNote.append($buttonResize);

    $thisNote.resize(function() {
        // console.log("original size", note.size.x, " ", note.size.y);
        // console.log("new size", $(this).outerWidth(), " ", $(this).outerHeight());
        // console.log("resizing");
        note.size.x = $(this).outerWidth();
        note.size.y = $(this).outerHeight();
        self.saveNoteSize(note, team);
    });


    // $thisNote.mouseup(function() {
    //     // console.log("this.position() ", $(this).position());
    //     // console.log("original note position", note.position);
    //     // console.log("attempting to save the position");
    //     // console.log("event.x and event.y", event.x, event.y);
    //     // $thisNote.css({
    //     //     'offset.left':  event.x + "px",
    //     //     'offset.top': event.y+'px'
    //     // });
    //     // console.log("what is note?", note);
    //     console.log("drag mouseup");
    //     note.position.x = $(this).position().left;
    //     note.position.y = $(this).position().top;
    //     self.saveNotePosition(note, team);
    // });

    $('body').append($thisNote);
    return $thisNote;
};

GLOBALS_WEB_NOTES.renderNote = function(note,team)
{
    console.log("rendering note");
    // console.log("renderNote", note, team);
    var self = this;
    var $thisNote = this.buildNote(note,team);
    $thisNote.css({
        'overflow': 'auto'
    });
    var message = note.message ? note.message : "";
    // console.log(message);
    $thisNote.html('<span>'+message+'</span>');
    $thisNote.click(function(){
        console.log("clicked renderNote");
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
    $form.css({
        'width': '95%',
        'height': '90%'
    });
    // $form.attr({
    //     'class': 'webnote colors'
    // });
    var $messageInput = $('<textarea></textarea>');
    //  $messageInput.attr({
    //     'id': 'noteform'
    // });
    $messageInput.attr('rows','10');
    $messageInput.css({
        'width': '100%',
        'height': '80%',
        'resize': 'none',
        'background-color': $thisNote.css('background-color'),
        'border-style': 'none',
        'box-sizing': "border-box"
    });

    var message = note.message ? note.message : "";
    $messageInput.html(message);
    var $teamSelect = $('<select></select>');
    $teamSelect.css({
        // 'class': 'webnote',
        //'padding': '5px 8px',
        'width': '37%',
        'height': '15%',
        'border': 'none',
        'box-shadow': 'none',
        'background': 'transparent',
        '-webkit-appearance': 'none',
        'text-align': 'center',
        'whte-space': 'nowrap'
        // 'border': '2px solid purple',
        //  'width': '200px;',
        // '-webkit-border-radius': '5px',
        // '-moz-border-radius': '5px',
        // 'border-radius': '5px'
    });
    $teamSelect.attr("id", "selectTeam");
    var $optionCurrent = $('<option></option>');
    $optionCurrent.attr('value', team._id);
    $optionCurrent.html(team.name);
    $teamSelect.append($optionCurrent);
    GLOBALS_WEB_NOTES.teamList.forEach(function(teamOp){
        if(teamOp._id===team._id) return;
        var $option = $('<option></option>');
        $option.css({
            // 'class': 'webnote',
            'display': "inline-block"
        });
        $option.attr('value', teamOp._id);
        $option.html(teamOp.name);
        $teamSelect.append($option);
    });

   //color
    var colors = ['yellow','red', 'pink', 'white', 'green', 'blue', 'orange', 'purple'];
    var $colorSelect = $('<select></select>');
    $colorSelect.css({
        'class': 'colors',
        'width': '37%',
        'height': '15%',
        'border-style': 'none',
        // 'border-color': 'black',
        'box-shadow': 'none',
        'background': 'transparent',
        '-webkit-appearance': 'none',
        'text-align': 'center',
        'float': 'right',
        'whte-space': 'nowrap'
    });
    $colorSelect.attr("id", "selectColor");
    var $colorCurrent = $('<option></option>');
    $colorCurrent.attr('value', note.color);
    $colorCurrent.html(note.color);
    $colorSelect.append($colorCurrent);
    colors.forEach(function(color){
        if(color===note.color) return;

        var $optionColor = $('<option></option>');
        $optionColor.css({
            // 'class': 'colors',
             // 'value': note.color,
             // 'selected': note.color,
             'display': "inline-block"
        });
        $optionColor.attr('value', color);
        $optionColor.html(color);
        $colorSelect.append($optionColor);
    });


    var saveIcon = chrome.extension.getURL("/icons/save.png");
    var $buttonSave = $('<button></button>');
    // invisible buttons
    $buttonSave.css({
        'height': '0px',
        'width': '0px',
        'padding': '0',
        // 'cursor': 'pointer',
        // 'background': 'url('+saveIcon+')',
        'border': '0px',
        'position': 'absolute',
        'right': '0px',
        'bottom': '0px',
        // 'display': 'none'
    });

    $buttonSave.attr('type', 'submit');
    // $thisNote.hover(function() {
    //     $buttonSave.css({'display': 'block'});
    // }, function() {
    //     $buttonSave.css({'display': 'none'});
    // });

    $form.submit(function(e){
        e.preventDefault();
        console.log("form.submit self: ", self);
        self.saveNote(note._id,
            $messageInput.val(),
            // {
            //     x: $thisNote.outerWidth(),
            //     y: $thisNote.outerHeight()
            // },
            $colorSelect.children("option:selected").html(),
            {
                _id: $teamSelect.val(),
                name: $teamSelect.children("option:selected").html()
            },
            team);
    });

    //$teamSelect.option($teamSelect.selectedIndex).html()

    // var cancelIcon = chrome.extension.getURL("/icons/cancel.png");
    // var $buttonCancel = $('<div></div>');
    // // $buttonCancel.attr("'class': 'webnote'");
    // $buttonCancel.css({
    //     // '-webkit-appearance': 'push-$button'
    //     'height': '30px',
    //     'width': '30px',
    //     'cursor': 'pointer',
    //     'background-image': 'url('+cancelIcon+')',
    //     'position': 'absolute',
    //     'right': '55px',
    //     'bottom': '15px',
    // });
    // // $buttonCancel.html('Cancel');
    // $buttonCancel.click(function(){
    //     self.unrenderNote(note._id);
    //     self.renderNote(note,team);
    // });

    var deleteIcon = chrome.extension.getURL("/icons/delete.png");
    var $buttonDestroy = $('<div></div>');
    // $buttonDestroy.attr("'class': 'webnote'");
    $buttonDestroy.css({
        // '-webkit-appearance': 'push-$button',
        'height': '30px',
        'width': '30px',
        'cursor': 'pointer',
        'background-image': 'url('+deleteIcon+')',
        'position': 'absolute',
        'left': '-15px',
        'top': '-15px',
        'display': 'none'
    });

    // $buttonDestroy.html('Destroy');
    $buttonDestroy.click(function(){
        self.destroyNote(note._id);
    });
        $thisNote.actions = [];
    var $buttonRecord = $('<button></button>')
        $buttonRecord.css('-webkit-appearance','push-$button');
        $buttonRecord.html('Record');

        $buttonRecord.click(function(){
            $thisNote.winWidthRecord = window.innerWidth;
            $thisNote.winHeightRecord = window.innerHeight;
            var startDate = new Date();
            console.log("Recording!");
            document.onmousemove = function(e){
                var date = new Date();
                var moveObj = {
                    x: e.pageX,
                    y: e.pageY,
                    type: 'move',
                    time: date - startDate
                };
                $thisNote.actions.push(moveObj);
            };
            document.onclick = function(e){
                var date = new Date();
                var clickObj = {
                    x: e.pageX,
                    y: e.pageY,
                    type: 'click',
                    time: date - startDate
                    };
                $thisNote.actions.push(clickObj);
                console.log($thisNote.actions);
                };
            document.onkeyup = function (e){
                var date = new Date();
                var keyObj = {
                 data: e.keyCode,
                 type: 'keypress',
                 time: date - startDate
                };
                $thisNote.actions.push(keyObj);
            };

        });
    var $buttonStop = $('<button></button>');
        $buttonStop.css('-webkit-appearance','push-$button');
        $buttonStop.html('Stop');
        $buttonStop.click(function() {
            console.log("height " + $thisNote.winHeightRecord,"width " + $thisNote.winWidthRecord); 
            $thisNote.actions.splice(0,3);
            document.onclick = null;
            document.onmousemove = null;
            document.onkeyup = null;
        });
    var $buttonPlay = $('<button></button>');
        $buttonPlay.css('-webkit-appearance','push-$button');
        $buttonPlay.html('Play');
    var $playball = $('<img id="theball" src="http://www.clker.com/cliparts/b/3/b/d/11971252702040963370chris_sharkot_ball.svg.med.png" height="10px" width="10px">');
        $playball.css({
            'zIndex': 2147483647,
            'position': 'absolute'
        });
        $buttonPlay.click(function() {
            var playHeight = Number(window.innerHeight);
            var playWidth = Number(window.innerWidth);
            // console.log("record height " + $thisNote.winHeightRecord,"record width " + $thisNote.winWidthRecord);
            // console.log("play height " + playHeight, "play width " + playWidth);
            // SCALAR_H = playHeight / $thisNote.winHeightRecord;
            // SCALAR_W = playWidth / $thisNote.winWidthRecord;
            // console.log("height scalar ", SCALAR_H, "width_scalar ", SCALAR_W); 
            // console.log("transformed current ", playHeight / SCALAR_H, " width ", playWidth / SCALAR_W);
            $('body').append($playball);
            console.log($thisNote.actions.length);
            var beforetime = 0;
            for(var i=0;i<$thisNote.actions.length; i++) {  
                console.log($thisNote.actions[i].x);
                var timeDifference = $thisNote.actions[i].time - beforetime;
                beforetime = $thisNote.actions[i].time;
                var theAnimation = function (){
                    var indexTracker = i;
                    $('#theball').animate({
                         left: ($thisNote.actions[i].x),
                         top: ($thisNote.actions[i].y)
                    }, timeDifference, function() {
                       if(indexTracker < $thisNote.actions.length && $thisNote.actions[indexTracker].type === 'click') {
                        console.log('event', $thisNote.actions[indexTracker]);
                        console.log(document.elementFromPoint($thisNote.actions[indexTracker].x+11, $thisNote.actions[indexTracker].y+11));
                        document.elementFromPoint($thisNote.actions[indexTracker].x+11, $thisNote.actions[indexTracker].y+11).click();
                       }
                       else if (indexTracker < $thisNote.actions.length && $thisNote.actions[indexTracker].type === 'keypress') {
                        console.log('keypress!!', $thisNote.actions[indexTracker]);
                        jQuery.event.trigger({ type : 'keypress', which : $thisNote.actions[indexTracker].data });
                        }
                    });
                };
                    setTimeout(theAnimation(), 0);
            }
        });

    $thisNote.hover(function() {
        $buttonDestroy.css({'display': 'block'});
    }, function() {
        $buttonDestroy.css({'display': 'none'});
    });

    $teamSelect.change(function() {
        $buttonSave.trigger('submit');
    });

    $colorSelect.change(function() {
        $buttonSave.trigger('submit');
    });
    $messageInput.blur(function() {
        $buttonSave.trigger('submit');
    });

    $form.append($messageInput);
    $form.append($teamSelect);
    $form.append($colorSelect);
    $form.append($buttonSave);
    // $thisNote.append($buttonCancel);
    $thisNote.append($buttonDestroy);
    $thisNote.append($buttonRecord);
    $thisNote.append($buttonStop);
    $thisNote.append($buttonPlay);
    $thisNote.append($form);
};

GLOBALS_WEB_NOTES.unrenderNote = function(noteId){
    console.log("unrendering note");
    $('#'+noteId).remove();
};

GLOBALS_WEB_NOTES.unrenderNoteForm = function(noteId){
    console.log("unrendering note form");
    $('#'+noteId).remove();
};

GLOBALS_WEB_NOTES.destroyNote = function(noteId){
    var self = this;
    chrome.runtime.sendMessage({title: "destroyNote",noteId: noteId},function(confirmation){
        if(confirmation==='deleted'){
            console.log("deleting");
            // close animation effect
            $('#'+noteId).css({
                'webkitTransition': '-webkit-transform 0.5s ease-in, opacity 0.5s ease-in',
                'webkitTransformOrigin': '0 0',
                'webkitTransform': 'skew(30deg, 0deg) scale(0)',
                'opacity': '0'
            });

            setTimeout(function() {
                self.unrenderNote(noteId);
            }, 1000);
        }
    });
};


GLOBALS_WEB_NOTES.saveNoteSize = function(note, team){
    console.log("saving size");
    var self = this;
    chrome.runtime.sendMessage({
        title: "saveNoteSize",
        noteId: note._id,
        size: note.size,
        team: team._id
    });
};


GLOBALS_WEB_NOTES.saveNotePosition = function(note, team){
    console.log("saving position");

    var self = this;
    chrome.runtime.sendMessage({
        title: "saveNotePosition",
        noteId: note._id,
        position: note.position,
        size: note.size,
        team: team._id
    });
};


GLOBALS_WEB_NOTES.saveNote = function(noteId, message, color, newTeam, oldTeam){
    var self = this;
    chrome.runtime.sendMessage({
        title: "saveNote",
        noteId: noteId,
        // size: size,
        color: color,
        message: message,
        newTeam: newTeam._id,
        oldTeam: oldTeam._id
    },function(changedNote){
        console.log("saving note");
        self.unrenderNote(noteId);
        self.renderNote(changedNote,newTeam);
    });
};

GLOBALS_WEB_NOTES.clearNotes = function(noteId){
    $('.web-notes-id-class').remove();
};
