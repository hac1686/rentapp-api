const admin = require('firebase-admin')


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://rentapp-api-hc.firebaseio.com'
  });
}

const db = admin.firestore()


exports.getProperties = (req, res) => {

  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }
  db.collection('properties').get()
    .then(snapshot =>{
      const propertyResults = snapshot.docs.map(doc =>{
        let singleProperty = doc.data()
        singleProperty.id = doc.id 
        return singleProperty;
      })
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');//before we return the results let them be cacheable, smax is how long it can cache on the edge server
      res.status(200).json(propertyResults);
    })
    .catch(err => {
      console.log('Error retrieving Properties '+ err);
      res.status(500).send('Error retrieving Properties '+ err);
    })

  
}

exports.updateProperty = (req, res) =>{

  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }

  const { propertyId } = req.params; //destructuring, like saying pull it out of request params
 // const propertyId = req.params.propertyId //assigning directly
  const propertyUpdates = req.body // { lastName: 'Frankenstein', age: 45}
  db.collection('properties').doc(propertyId).update(propertyUpdates)
  .then(docRef => {
    console.log('Updated property', propertyId)
    res.status(200).send('Updated property ' + propertyId)
  })
  .catch (err => {
    console.log('Error updating property ' + err);
    res.status(500).send('Error updating property: ' + err);
  })
}



exports.deleteProperty = (req, res) =>{

  if (!db) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rentapp-api-hc.firebaseio.com'
    });
    const db = admin.firestore()
  }

  const { propertyId } = req.params; //destructuring, like saying pull it out of request params
 // const propertyId = req.params.PropertyId //assigning directly
   db.collection('properties').doc(propertyId).delete()
  .then(docRef => {
    console.log('Deleted Property', propertyId)
    res.status(200).send('deleted Property ' + propertyId)
  })
  .catch (err => {
    console.log('Error deleting Property ' + err);
    res.status(500).send('Error deleting Property: ' + err);
  })
}


//we want to connect this to the db
exports.createProperty = (req, res) => {
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
  const newProperty = req.body
  db.collection('properties').add(newProperty)
    .then(docRef => {
      console.log('Created Property', docRef.id)
      res.status(200).send('Created Property ' + docRef.id)
    })
    .catch (err => {
      console.log('Error creating Property ' + err);
      res.status(500).send('Error creating Property: ' + err);
    })
}