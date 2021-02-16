//external libraries imported
const functions = require("firebase-functions");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors') 
//internal import from the project
const {getUsers, createUser, updateUser, deleteUser} = require('./src/users')//import internal file needs curly braces
const {getProperties, createProperty, updateProperty, deleteProperty } = require('./src/properties')

//creating an instance of the express application/ the server
const app = express(); //create express server
app.use(bodyParser.json());
app.use(cors())

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


// app.get('/users', (req,res) =>{
//   res.send('Here is a list of users')
// });

//setting up the routes

app.get('/users', getUsers);//return the getUsers function
app.post('/users', createUser);//return the getUsers function
app.patch('/users/:userId', updateUser)
app.delete('/users/:userId', deleteUser)

app.get('/properties', getProperties)
app.post('/properties', createProperty)
app.patch('/properties/:propertyId', updateProperty)
app.delete('/properties/:propertyId', deleteProperty)

//works with the firebase.json
exports.app = functions.https.onRequest(app); //this is the app we are sending out to the world, any requests that come in to this function we will handle with the express app


