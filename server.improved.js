const express = require( 'express' ),
      app = express(),
      passport = require( 'passport' ),
      LocalStrategy = require( 'passport-local' ).Strategy,
      OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
      githhub = require( 'passport-github2' ).Strategy,
      bodyParser = require( 'body-parser' ),
      port = 3000
      //flash = require("connect-flash");

app.use( express.static(__dirname + '/public' ) );
app.use( bodyParser.json() );
//app.use(flash());
// app.use(require('express-session')({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true
// }));

var admin = require('firebase-admin');
var serviceAccount = require("./serviceKey2.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://a3-webware.firebaseio.com'
});

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/items.html');
});

app.get('/receive', function (request, response) {
  ref.on("value", function(snapshot) {
    console.log(snapshot.val());
    response.end(JSON.stringify(snapshot.val()))
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});

var db = admin.database();
var ref = db.ref("/");
var usersRef = ref.child("users");

require('firebase/app');
require("firebase/firestore");

passport.use('local', new LocalStrategy( {
  usernameField: 'name',
  passwordField: 'Board'
}, function( name, Board, done ) {

  let myData = {};
  console.log("ddddddd");

  ref.on("value", function (snapshot) {
    console.log("fffffff");
    console.log(snapshot.val());
    myData = snapshot.val();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  setTimeout(function() {
    console.log('Yeee' + myData);
    const user = myData.users[name];

    if( user === undefined || user ===  null ) {
      console.log("user not found");
      return done( null, false, { message:'user not found' })
    }else{

      const pass = myData.users[name][Board];
      if( pass !==  null && pass !== undefined) {
        console.log("successfully authenticated");
        return done(null, {name, Board})
      } else {
        console.log("incorrect password");
        return done( null, false, { message: 'incorrect password' })
      }
    }
  }, 1000);


}));

app.use(passport.initialize());
//app.use(passport.session());

passport.serializeUser(function(name, done) {
  done(null, name);
});

passport.deserializeUser(function(name, done) {
  done(null, name);
});

app.post( '/login', passport.authenticate( 'local' ), function( req, res ) {
  console.log( 'user:', req.body.name );
  res.json({'status': true});
});


app.post( '/submit', function( request, response ) {

  json = request.body;

  if(Object.keys(json).length === 4) {
    var username = JSON.stringify(json.name).replace(/^"(.*)"$/, '$1');
    var email = username + "@tasktracker.com"
    var emailKey = "email"

    json2 = {
      "1": {
        "listname": "list1",
        "taskNums": 1,
        "tasks": {
          "1": {
            "taskName": "Add a task",
            "taskDesc": "Add a new task or edit this one",
            "taskDue": "The Time and Date by which task is due"
          }
        }
      }
    };

    json[emailKey] = email

    writeUserData(json.name, json.Board, json.name, json.fullname, json.email, json.Color, json.Board, json2)
  } else if(Object.keys(json).length === 3) {
    writeUserData2(json.name, json.Board, json.listNameEdit)
  } else if(Object.keys(json).length === 6) {
    writeUserData3(json.name, json.Board, json.taskName, json.taskDes, json.dueDate, json.taskNum)
  }else if(Object.keys(json).length === 7) {
    writeUserData4(json.name, json.Board, json.taskNum, json.taskName, json.taskDes, json.dueDate)
  }else if(Object.keys(json).length === 5) {
    writeUserData5(json.name, json.Board, json.taskNum)
  }

  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( request.body ) )
})

function writeUserData(ref, refBoard, username, fullname, email, color, boardName, lists) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  boardRef.set({
    username: username,
    fullname: fullname,
    email: email,
    color: color,
    boardName: boardName,
    lists: lists
  });
}

function writeUserData2(ref, refBoard, listName) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  listsRef.update({
    listname: listName
  });
}

function writeUserData3(ref, refBoard, taskName, taskDesc, taskDue, taskNum) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  listsRef.update({
    taskNums: parseInt(taskNum)
  });
  var tasksRef = listsRef.child("tasks");
  var taskRef = tasksRef.child(taskNum)
  taskRef.set({
    taskName: taskName,
    taskDesc: taskDesc,
    taskDue: taskDue
  });
}

function writeUserData4(ref, refBoard, taskNum, taskName, taskDesc, taskDue) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  var tasksRef = listsRef.child("tasks");
  var taskRef = tasksRef.child(taskNum);
  taskRef.update({
    taskName: taskName,
    taskDesc: taskDesc,
    taskDue: taskDue
  });
}

function writeUserData5(ref, refBoard, taskNum) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  var tasksRef = listsRef.child("tasks");
  var taskRef = tasksRef.child(taskNum);
  taskRef.remove().then(function() {
    console.log("Remove succeeded.")
  })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
}

app.listen( process.env.PORT || port )
