const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.database();
var refUserRental = db.ref("user_rentals");

//
// exports.editUserRentals = functions.database.ref('/rentals/{pushId}/title')
//     .onUpdate((change, context) => {
//         const title = change.after.val();
//        refUserRental.once('value').then((snap) =>{
//             console.log('user_rentals', snap.val());
//         });
//         return true;
//     });