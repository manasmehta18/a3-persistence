const express = require( 'express' ),
      app = express(),
      session = require( 'express-session' ),
      passport = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
      githhub = require( 'passport-github2' ).Strategy,
      bodyParser = require( 'body-parser' ),
      port = 3000


app.use( express.static(__dirname + '/public' ) );
app.use( bodyParser.json() )


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

app.use( function (request, response, next ) {
    json = request.body;
    jsonU = {
      username: json.name,
      boardName: json.Board
    }
    if(Object.keys(json).length === 3) {
      writeUserData2(json.name, json.Board, json.listNameEdit)
    } else if(Object.keys(json).length === 6) {
      writeUserData3(json.name, json.Board, json.taskName, json.taskDes, json.dueDate, json.taskNum)
    }else if(Object.keys(json).length === 7) {
      writeUserData4(json.name, json.Board, json.taskNum, json.taskName, json.taskDes, json.dueDate)
    }else if(Object.keys(json).length === 5) {
      writeUserData5(json.name, json.Board, json.taskNum)
    }
    next()

})

app.post( '/login', function( request, response ) {

  json = request.body;
  jsonU = {
    username: json.name,
    boardName: json.Board
  }

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
  }
  if(Object.keys(json).length === 2) {

    ref.on("value", function (snapshot) {
      console.log(snapshot.val());
      response.end(JSON.stringify(snapshot.val()))
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }


  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( request.json ) )
})

app.post( '/submit', function( request, response ) {
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

const myLocalStrategy = function( username, password, done ) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!

  const user = users.find( __user => __user.username === username )

  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done( null, false, { message:'user not found' })
  }else if( user.password === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'incorrect password' })
  }
}

passport.use( new Local( {
  username: 'name',
  boardName: 'Board'
} , myLocalStrategy ) )
passport.initialize()

app.listen( process.env.PORT || port )
