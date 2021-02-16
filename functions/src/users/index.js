const admin = require('firebase-admin')


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://rentapp-api-hc.firebaseio.com'
  });
}

const db = admin.firestore()


exports.getUsers = (req, res) => {

  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }
  db.collection('users').get()
    .then(snapshot =>{
      const userResults = snapshot.docs.map(doc =>{
        let singleUser = doc.data()
        singleUser.id = doc.id 
        return singleUser;
      })
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');//before we return the results let them be cacheable, smax is how long it can cache on the edge server
      res.status(200).json(userResults);
    })
    .catch(err => {
      console.log('Error retrieving users '+ err);
      res.status(500).send('Error retrieving users '+ err);
    })

  
}

exports.updateUser = (req, res) =>{

  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }

  const { userId } = req.params; //destructuring, like saying pull it out of request params
 // const userId = req.params.userId //assigning directly
  const userUpdates = req.body // { lastName: 'Frankenstein', age: 45}
  db.collection('users').doc(userId).update(userUpdates)
  .then(docRef => {
    console.log('updated User', userId)
    res.status(200).send('updates user ' + userId)
  })
  .catch (err => {
    console.log('Error updating user ' + err);
    res.status(500).send('Error updating user: ' + err);
  })
}



exports.deleteUser = (req, res) =>{

  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }

  const { userId } = req.params; //destructuring, like saying pull it out of request params
 // const userId = req.params.userId //assigning directly
   db.collection('users').doc(userId).delete()
  .then(docRef => {
    console.log('Deleted User', userId)
    res.status(200).send('deleted user ' + userId)
  })
  .catch (err => {
    console.log('Error deleting user ' + err);
    res.status(500).send('Error deleting user: ' + err);
  })
}


//we want to connect this to the db
exports.createUser = (req, res) => {
  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }
  // for now... let's send back the data we receive 
  // TODO: save the data we get to a database

  //check and see if the connection is still open, if not then reconnect
  const newUser = req.body
  db.collection('users').add(newUser)
    .then(docRef => {
      console.log('Created User', docRef.id)
      res.status(200).send('Created user ' + docRef.id)
    })
    .catch (err => {
      console.log('Error creating user ' + err);
      res.status(500).send('Error creating user: ' + err);
    })
}