const express = require( 'express' ),
      app = express(),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      session = require( 'express-session' ),
      passport = require( 'passport' ),
      OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
      githhub = require( 'passport-github2' ).Strategy,
      bodyParser = require( 'body-parser' ),
      dir  = 'public/',
      port = 3000,
      dreams = []

app.use( express.static('/') )
app.use( bodyParser.json() )

app.use( express.static(__dirname + '/public' ) );

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
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    json = JSON.parse( dataString )
    dreams.push( json )
    // add a 'json' field to our request object
    request.json = JSON.stringify( dreams )

    // ... do something with the data here!!!
    if(Object.keys(json).length === 4) {
      var username = JSON.stringify(json.name).replace(/^"(.*)"$/, '$1');
      var email = username + "@tasktracker.com"
      var emailKey = "email"

      json2 = {
        "1" : {
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

    next()
  })
})

app.post( '/submit', function( request, response ) {
  // our request object now has a 'json' field in it from our
  // previous middleware
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( request.json ) )
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
