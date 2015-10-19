var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Team = Promise.promisifyAll(mongoose.model('Team'));
var Note = Promise.promisifyAll(mongoose.model('Note'));
var Page = Promise.promisifyAll(mongoose.model('Page'));
var _ = require('lodash');

// Clear database
User.remove({}, function(err, removed) {
  if (err) console.log(err);
});

Team.remove({}, function(err, removed) {
  if (err) console.log(err);
});

Note.remove({}, function(err, removed) {
  if (err) console.log(err);
});

Page.remove({}, function(err, removed) {
  if (err) console.log(err);
});

var seedUser = [{
  name: 'Drew',
  email: 'drew@drew.com',
  password: '123'
}, {
  name: 'Karen',
  email: 'karen@karen.com',
  password: '123'
}, {
  name: 'Mark',
  email: 'mark@mark.com',
  password: '123'
}, {
  name: 'Dan',
  email: 'dan@dan.com',
  password: '123'
}, {
  name: 'Connie',
  email: 'connie@connie.com',
  password: '123'
}];

var seedTeam = function(users) {
  return Team.createAsync([{
    name: "Web Dev",
    users: [users[0], users[1], users[2], users[3], users[4]]
  }, {
    name: "Marketing",
    users: [users[0], users[3], users[4]]
  }, {
    name: "Design",
    users: [users[0], users[1]]
  }, {
    name: "Company-All",
    users: [users[0], users[1], users[2], users[3], users[4]]
  }, {
    name: "Personal",
    users: [users[0]]
  }, {
    name: "Personal",
    users: [users[1]]
  }, {
    name: "Personal",
    users: [users[2]]
  }, {
    name: "Personal",
    users: [users[3]]
  }, {
    name: "Personal",
    users: [users[4]]
  }]);
};

var seedNote = function(users) {
  return Note.createAsync([{
    owner: users[0],
    message: '<img style="width: 200px" src="http://handmadefont.com/wp-content/uploads/2014/05/black-wire-font-letter-N.png"></img>',
    color: "blue",
    position: {
      x: 4,
      y: 74
    },
    size: {
      x: 234,
      y: 228
    }
  }, {
    owner: users[0],
    message: '<img style="width: 200px" src="http://handmadefont.com/wp-content/uploads/2014/06/redpaprika-font-letter-O.png"></img>',
    color: "pink",
    position: {
      x: 28,
      y: 42
    },
    size: {
      x: 246,
      y: 225
    }
  }, {
    owner: users[0],
    message: '<img style="width: 200px" src="http://handmadefont.com/wp-content/uploads/2015/06/Buttons-color-font-letter-T.png"></img>',
    color: "green",
    position: {
      x: 53,
      y: 66
    },
    size: {
      x: 232,
      y: 224
    }
  }, {
    owner: users[0],
    message: '<img style="width: 200px" src="http://handmadefont.com/wp-content/uploads/2013/09/Onions-font-letter-O-200x200.png"></img>',
    color: "purple",
    position: {
      x: 78,
      y: 52
    },
    size: {
      x: 240,
      y: 230
    }
  }, {
    owner: users[0],
    message: '<img src="https://31.media.tumblr.com/166ef9fe6547ae7e3e22061f82cbc1eb/tumblr_niwf9lBNff1qjshvjo1_400.gif"</img><br><h1>xoxo,<br>your roommate</h1>',
    color: "yellow",
    position: {
      x: 33,
      y: 13
    },
    size: {
      x: 394,
      y: 336
    }
  }, {
    owner: users[0],
    message: "<h1>You shouldn't be on this site<br>Love,<br>Mom</h1>",
    color: "red",
    position: {
      x: 1,
      y: 46
    },
    size: {
      x: 1300,
      y: 600
    }
  }, {
    owner: users[2],
    message: 'We can use the letter glyphicon for an email button\n-Mark',
    color: "yellow",
    position: {
      x: 28,
      y: 230
    },
    size: {
      x: 200,
      y: 200
    }
  }, {
    owner: users[4],
    message: 'I like this side navbar\n-Connie',
    color: "yellow",
    position: {
      x: 77,
      y: 145
    },
    size: {
      x: 200,
      y: 200
    }
  }, {
    owner: users[3],
    message: '<iframe width="420" height="315" src="https://www.youtube.com/embed/_IdLyFJf6UI" frameborder="0" allowfullscreen></iframe>',
    color: "yellow",
    position: {
      x: 6,
      y: 15
    },
    size: {
      x: 365,
      y: 500
    }
  }, {
    owner: users[3],
    message: '<h1><span style="color:#ff0000;">H</span><span style="color:#ff4000;">T</span><span style="color:#ff7f00;">M</span><span style="color:#ffbf00;">L</span><span style="color:#bbff00;">!</span><span style="color:#00ff00;">!</span><span style="color:#00ff80;">!</span><span style="color:#00ffff;">!</span><span style="color:#0080ff;">!</span><span style="color:#0000ff;">!</span></h1>',
    color: "yellow",
    position: {
      x: 57,
      y: 61
    },
    size: {
      x: 200,
      y: 200
    }
  }, {
    owner: users[0],
    message: 'check out the recording\n-drew',
    color: "yellow",
    position: {
      x: 10,
      y: 10
    },
    size: {
      x: 200,
      y: 200
    }
  }]);
};

var seedPage = function(teams, notes) {
  return Page.createAsync([{
    url: 'https://www.google.com/',
    team: teams[0],
    notes: [notes[0], notes[1], notes[2], notes[3]]
  }, {
    url: 'https://www.seamless.com/',
    team: teams[4],
    notes: [notes[4]]
  }, {
    url: 'http://www.badsite.com/',
    team: teams[4],
    notes: [notes[5]]
  }, {
    url: 'http://getbootstrap.com/components/',
    team: teams[1],
    notes: [notes[6], notes[7]]
  }, {
    url: 'https://learn.fullstackacademy.com/',
    team: teams[2],
    notes: [notes[8], notes[9]]
  }, {
    url: 'https://www.sweetpunk.com/',
    team: teams[3],
    notes: [notes[10]]
  }]);
};

connectToDb.then(function() {
  var saveUsers, saveNotes;
  // Users
  User.createAsync(seedUser)
    .then(function(users) {
      saveUsers = users;
      return seedNote(users);
    })
    .then(function(notes) {
      // Notes
      saveNotes = notes;
      // Teams
      return seedTeam(saveUsers);
    })
    .then(function(teams) {
      // Pages
      return seedPage(teams, saveNotes);
    })
    .then(function() {
      console.log(chalk.green('Seed successful!'));
      process.kill(0);
    })
    .catch(function(err) {
      console.error(err);
      process.kill(1);
    });
});
