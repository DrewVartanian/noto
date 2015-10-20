GLOBALS_WEB_NOTES.buildNote = function(note, team) {
  var self = this;
var backgroundImg = chrome.extension.getURL("/icons/postit_edited.png");
  var $thisNote = $('<div></div>');
  // $thisNote.html('<img style="z-index: -1; top: 0px; left: 0px; position: absolute; height: 100%; width: 100%" src="'+backgroundImg+'"></img>')
  var colors = ['yellow', 'red', 'pink', 'white', 'green', 'blue', 'orange', 'purple'];
  $thisNote.attr({
    'id': note._id,
    'data-team-name': team.name,
    'data-team-id': team._id,
    'color': colors
  });
  $thisNote.addClass("web-notes-id-class");

  $thisNote.css({
    'overflow': 'none',
    'padding': '10px',
    'background-image': "url(" + backgroundImg + ")",
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    // '-webkit-background-size': 'cover',
    'left': note.position.x * $(document).width() / 100 + 'px',
    'top': note.position.y + 'px',
    'height': note.size.y + 'px',
    'width': note.size.x + 'px',
    'zIndex': 2147483647,
    'position': 'absolute',
    'box-sizing': "border-box",
    'font-family': 'Gloria Hallelujah',
    'font-size': '15px',
    // 'box-shadow': '0px 4px 6px #333',
    // '-webkit-box-shadow': '0px 4px 6px #333',
    'opacity': '0.8',
    'white-space': 'pre-wrap',
    'word-wrap': 'break-word'
      //  '-webkit-transform': 'rotate(4deg)',
  });


  $thisNote.draggable({
    cursor: 'move',
    stop: function() {
      note.position.x = 100 * $(this).position().left / $(document).width();
      note.position.y = $(this).position().top;
      self.saveNotePosition(note, team);
    }
  });

  $thisNote.resizable({
    minWidth: 200,
    minHeight: 200,
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

GLOBALS_WEB_NOTES.renderNote = function(note, team) {
  var self = this;
  var $thisNote = this.buildNote(note, team);
  $thisNote.css({
    'overflow': 'auto'
  });
  var message = note.message ? note.message : "";
  $thisNote.html('<span>' + message + '</span>');
  $thisNote.click(function() {
    console.log("clicked renderNote");
    self.unrenderNote(note._id);
    self.renderNoteForm(note, team);
  });

};

GLOBALS_WEB_NOTES.renderNoteForm = function(note, team) {
  console.log("renderNoteForm");
  var self = this;
  var $thisNote = this.buildNote(note, team);
  var $form = $('<form></form>');
  $form.css({
    'width': '95%',
    'height': '90%'
  });

  var $messageInput = $('<textarea></textarea>');

  $messageInput.attr('rows', '10');
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
    'width': '37%',
    'height': '15%',
    'border': 'none',
    'box-shadow': 'none',
    'background': 'transparent',
    '-webkit-appearance': 'none',
    'text-align': 'center',
    'whte-space': 'nowrap'
  });

  $teamSelect.attr("id", "selectTeam");
  var $optionCurrent = $('<option></option>');
  $optionCurrent.attr('value', team._id);
  $optionCurrent.html(team.name);
  $teamSelect.append($optionCurrent);
  GLOBALS_WEB_NOTES.teamList.forEach(function(teamOp) {
    if (teamOp._id === team._id) return;
    var $option = $('<option></option>');
    $option.css({
      'display': "inline-block"
    });
    $option.attr('value', teamOp._id);
    $option.html(teamOp.name);
    $teamSelect.append($option);
  });

  //color
  var colors = ['yellow', 'red', 'pink', 'white', 'green', 'blue', 'orange', 'purple'];
  var $colorSelect = $('<select></select>');
  $colorSelect.css({
    'class': 'colors',
    'width': '37%',
    'height': '15%',
    'border-style': 'none',
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
  colors.forEach(function(color) {
    if (color === note.color) return;

    var $optionColor = $('<option></option>');
    $optionColor.css({
      'display': "inline-block"
    });
    $optionColor.attr('value', color);
    $optionColor.html(color);
    $colorSelect.append($optionColor);
  });


  var saveIcon = chrome.extension.getURL("/icons/save.png");
  var $buttonSave = $('<button></button>');
  // invisible button
  $buttonSave.css({
    'height': '0px',
    'width': '0px',
    'padding': '0',
    'border': '0px',
    'position': 'absolute',
    'right': '0px',
    'bottom': '0px',
  });

  $buttonSave.attr('type', 'submit');

  $form.submit(function(e) {
    e.preventDefault();
    console.log("form.submit self: ", self);
    self.saveNote(note._id,
      $messageInput.val(),
      $colorSelect.children("option:selected").html(), {
        _id: $teamSelect.val(),
        name: $teamSelect.children("option:selected").html(),
        actions: $thisNote.actions
      },
      team);
  });


  var deleteIcon = chrome.extension.getURL("/icons/delete.png");
  var $buttonDestroy = $('<div></div>');
  $buttonDestroy.css({
    '-webkit-appearance': 'push-$button',
    'height': '30px',
    'width': '30px',
    'cursor': 'pointer',
    'background-image': 'url(' + deleteIcon + ')',
    'position': 'absolute',
    'left': '-15px',
    'top': '-20px',
    'display': 'none'
  });

  $buttonDestroy.click(function() {
    self.destroyNote(note._id);
  });

  $thisNote.actions = [];
  var $actionMenu = $('<div></div>');
  $actionMenu.css({
    'height': '30px',
    'width': '110px',
    'cursor': 'pointer',
    'position': 'absolute',
    'right': '-15px',
    'top': '-20px',
    'display': 'none'
  });

  var recordIcon = chrome.extension.getURL("/icons/record.png");
  var $buttonRecord = $('<div></div>');
  $buttonRecord.css({
    '-webkit-appearance': 'push-$button',
    'height': '30px',
    'width': '30px',
    'cursor': 'pointer',
    'background-image': 'url(' + recordIcon + ')',
    'position': 'absolute',
    'left': '0px',
    'top': '0px',
  });

  var stopIcon = chrome.extension.getURL("/icons/stop.png");
  var $buttonStop = $('<div></div>');
  $buttonStop.css({
    '-webkit-appearance': 'push-$button',
    'height': '30px',
    'width': '30px',
    'cursor': 'pointer',
    'background-image': 'url(' + stopIcon + ')',
    'position': 'absolute',
    'left': '40px',
    'top': '0px'
  });

  $buttonStop.click(function() {
    console.log("height " + $thisNote.winHeightRecord, "width " + $thisNote.winWidthRecord);
    $thisNote.actions.splice(0, 3);
    document.onclick = null;
    document.onmousemove = null;
    document.onkeyup = null;
  });

  var playIcon = chrome.extension.getURL("/icons/play.png");
  var $buttonPlay = $('<div></div>');

  $buttonPlay.css({
    'height': '30px',
    'width': '30px',
    'cursor': 'pointer',
    'background-image': 'url(' + playIcon + ')',
    'position': 'absolute',
    'right': '0px',
    'top': '0px',
  });

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
            document.onscroll = function(e){
                console.log(e);
                var ymotion = $(document).scrollTop() / 3;
                var date = new Date();
                var scrollObj = {
                    y: ymotion,
                    type: 'scroll',
                    time: date - startDate
                    };
                $thisNote.actions.push(scrollObj);
                };
            document.onkeyup = function (e){
                var date = new Date();
                var keyObj = {
                 data: e.keyCode,
                 type: 'keypress',
                 time: date - startDate,
                 shifty: !!e.shiftKey
                };
                   var _to_ascii = {
                    '188': '44',
                    '109': '45',
                    '190': '46',
                    '191': '47',
                    '192': '96',
                    '220': '92',
                    '222': '39',
                    '221': '93',
                    '219': '91',
                    '173': '45',
                    '187': '61', //IE Key codes
                    '186': '59', //IE Key codes
                    '189': '45'  //IE Key codes
                }
                 var shiftUps = {
                   "96": "126",
                   "49": "33",
                   "50": "64",
                   "51": "35",
                   "52": "36",
                   "53": "37",
                   "54": "94",
                   "55": "38",
                   "56": "42",
                   "57": "40",
                   "48": "41",
                   "45": "95",
                   "61": "43",
                   "91": "123",
                   "93": "125",
                   "92": "124",
                   "59": "58",
                   "39": "92",
                   "44": "60",
                   "46": "62",
                   "47": "63"
               };
                if(_to_ascii.hasOwnProperty(keyObj.data)) keyObj.data =_to_ascii[keyObj.data]
                if (keyObj.shifty && shiftUps.hasOwnProperty(keyObj.data)) keyObj.data = shiftUps[keyObj.data];
                $thisNote.actions.push(keyObj);
            };

        });
        $buttonStop.click(function() {
            console.log("height " + $thisNote.winHeightRecord,"width " + $thisNote.winWidthRecord); 
            $thisNote.actions.splice(0,3);
            document.onclick = null;
            document.onmousemove = null;
            document.onkeyup = null;
        });
    var $playball = $('<img id="theball" src="http://www.fusionclothinguk.co.uk/eBay_shop_setup/star-blue-purple-glow.png" height="100px" width="100px">');
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
                var elementObj={};
                var parentsholder;
                var theAnimation = function (){
                    // if($thisNote.actions[i].time === $thisNote.actions[$thisNote.actions[i].length-1].time) $    ("#theball").remove();
                    var indexTracker = i;
                    // var mouseOverElement = document.elementFromPoint($thisNote.actions[indexTracker].x-1, $thisNote.actions[indexTracker].y-1).id
                    $('#theball').animate({
                         left: ($thisNote.actions[i].x-50),
                         top:  ($thisNote.actions[i].y-50),
                         opacity: 1
                    }, timeDifference, function() {
                        // $("#theball").get(0).scrollIntoView({block: "end", behavior: "smooth"});
                        // $("body, html").animate({ 
                        // scrollTop: $('#theball').offset().top 
                        // });
                        // $('#' + mouseOverElement).hover(function() {
                        //     $(this).attr('id', mouseOverElement + ":hover")}
                        //     ,function() {
                        //     $(this).attr('id', mouseOverElement + ":hover")});
                        // $('#' + mouseOverElement).mouseenter();
                        // // $('#' + mouseOverElement).mouseleave()
                        // console.log(mouseOverElement)
                      if(indexTracker < $thisNote.actions.length && $thisNote.actions[indexTracker].type === 'click') {
                        console.log('event', $thisNote.actions[indexTracker]);
                        $('#theball').css({
                            "height":"0px",
                            "width":"0px"
                        });
                        var element = document.elementFromPoint($thisNote.actions[indexTracker].x, $thisNote.actions[indexTracker].y)
                            var theParents = [];
                            $(element).parents().not('html').each(function() {
                                var path = this.tagName.toLowerCase();
                                if (this.className) {
                                    path += "." + this.className.replace(/ /g, '.');
                                }
                                theParents.push(path);
                            });
                            theParents.reverse();
                            console.log("PARENTS!",theParents.join(" "));
                            parentsholder = theParents.join(' ')
                       
                        console.log("here is the element", element)
                        console.log("element nodename", element.nodeName)
                        $('#theball').css({
                            "height":"100px",
                            "width":"100px"
                        });
                        if(element) {
                        if(element.nodeName==='INPUT'){
                            elementObj.id = element.id;
                            console.log(elementObj.id);
                            }
                        else if (element.className === 'ace_content'){
                            elementObj.theClass = (element.class)
                            console.log("drew an ace!")
                        }
                        element.click();
                       }
                        }
                      else if (indexTracker < $thisNote.actions.length && $thisNote.actions[indexTracker].type === 'keypress') {
                        console.log('keypress!!', $thisNote.actions[indexTracker]);
                        var e = jQuery.Event('keydown');
                        e.which = Number($thisNote.actions[indexTracker].data);
                        console.log('the element id!', elementObj.id);
                        console.log('the key data', Number($thisNote.actions[indexTracker].data));
                        if(elementObj.theClass){
                            $('.' + String(elementObj.theClass).toLowerCase()).trigger(e);
                            $('.' + String(elementObj.theClass).toLowerCase()).val(($('.' + String(elementObj.theClass).toLowerCase()).val() + String.fromCharCode(e.which)).toLowerCase())
                        } 
                        else if( elementObj.id) {
                        $('#' + String(elementObj.id).toLowerCase()).trigger(e);
                        $('#' + String(elementObj.id).toLowerCase()).val(($('#' + String(elementObj.id).toLowerCase()).val() + String.fromCharCode(e.which)).toLowerCase())
                            if(e.which === 8)  {
                            $('#' + String(elementObj.id).toLowerCase()).val(($('#' + String(elementObj.id).toLowerCase()).val().slice(0,$('#' + String(elementObj.id).toLowerCase()).val().length-2)))
                            }
                        }
                        else {
                          console.log("got this far!!!")
                          console.log("PARENT HOLDER", $(parentsholder));
                        $(parentsholder + ' input').trigger(e);
                        $(parentsholder + ' input').val(($(parentsholder+ ' input').val() + String.fromCharCode(e.which)).toLowerCase())
                            if(e.which === 8)  {
                            $(parentsholder+ ' input').val(($(parentsholder+ ' input').val().slice(0,$(parentsholder+ ' input').val().length-2)))
                            }
                        }
                        }
                      else if (indexTracker < $thisNote.actions.length && $thisNote.actions[indexTracker].type === 'scroll') {
                        $("#theball").get(0).scrollIntoView() 
                      }
                    });
                };
                    setTimeout(theAnimation(), 0);
            }
        });

  $thisNote.hover(function() {
    $buttonDestroy.css({
      'display': 'block'
    });
  }, function() {
    $buttonDestroy.css({
      'display': 'none'
    });
  });

  $thisNote.hover(function() {
    $actionMenu.css({
      'display': 'block'
    });
  }, function() {
    $actionMenu.css({
      'display': 'none'
    });
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

  $thisNote.append($form);
  $thisNote.append($buttonDestroy);
  $thisNote.append($actionMenu);

  $actionMenu.append($buttonRecord);
  $actionMenu.append($buttonStop);
  $actionMenu.append($buttonPlay);
};

GLOBALS_WEB_NOTES.unrenderNote = function(noteId) {
  console.log("unrendering note");
  $('#' + noteId).remove();
};

GLOBALS_WEB_NOTES.unrenderNoteForm = function(noteId) {
  console.log("unrendering note form");
  $('#' + noteId).remove();
};

GLOBALS_WEB_NOTES.destroyNote = function(noteId) {
  var self = this;
  chrome.runtime.sendMessage({
    title: "destroyNote",
    noteId: noteId
  }, function(confirmation) {
    if (confirmation === 'deleted') {
      console.log("deleting");
      // close animation effect
      $('#' + noteId).css({
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


GLOBALS_WEB_NOTES.saveNoteSize = function(note, team) {
  console.log("saving size");
  var self = this;
  chrome.runtime.sendMessage({
    title: "saveNoteSize",
    noteId: note._id,
    size: note.size,
    team: team._id
  });
};


GLOBALS_WEB_NOTES.saveNotePosition = function(note, team) {
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


GLOBALS_WEB_NOTES.saveNote = function(noteId, message, color, newTeam, oldTeam, actions){
    var self = this;
    chrome.runtime.sendMessage({
        title: "saveNote",
        noteId: noteId,
        // size: size,
        color: color,
        message: message,
        newTeam: newTeam._id,
        oldTeam: oldTeam._id,
        actions: actions
    },function(changedNote){
        console.log("saving note");
        self.unrenderNote(noteId);
        self.renderNote(changedNote,newTeam);
    });
};

GLOBALS_WEB_NOTES.clearNotes = function(noteId) {
  $('.web-notes-id-class').remove();
};
