const functions = require("firebase-functions");
const express = require('express')
const bodyParser = require('body-parser')
const {getUsers, createUser} = require('./src/users')//import internal file needs curly braces

const app = express(); //create express server
app.use(bodyParser.json());

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


// app.get('/users', (req,res) =>{
//   res.send('Here is a list of users')
// });

app.get('/users', getUsers);//return the getUsers function
app.post('/users', createUser);//return the getUsers function

exports.app = functions.https.onRequest(app); //this is the app we are sending out to the world, any requests that come in to this function we will handle with the express app


