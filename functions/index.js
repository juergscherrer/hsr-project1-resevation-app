// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const moment = require('moment');
const sendgridemail = require('@sendgrid/mail');
const MY_SENDGRID_API_KEY =
  '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';
sendgridemail.setApiKey(MY_SENDGRID_API_KEY);
exports.reservationEmail = functions.firestore
  .document('reservations/{reservationId}') //any write to this node will trigger email
  .onCreate((snap, context) => {
    const reservationId = snap.id;
    // const reservationId = 'AAvndR8lPElM6O1M1Y6e';
    const fsdb = admin.firestore();
    return fsdb
      .collection('reservations')
      .doc(reservationId)
      .get()
      .then(doc => {
        const reservationData = doc.data();
        fsdb
          .collection('users')
          .doc(reservationData.userId)
          .get()
          .then(doc => {
            const userData = doc.data();
            fsdb
              .collection('rentals')
              .doc(reservationData.rentalId)
              .get()
              .then(doc => {
                const rentalData = doc.data();
                const msgbody = {
                  to: ['juerg.scherrer@gmail.com'],
                  from: 'reservationapp@webmassiv.ch',
                  templateId: 'd-c401929fde70441e9499fb83e5b6bd1f',
                  dynamic_template_data: {
                    startDate: reservationData.startDate.toDate(),
                    endDate: reservationData.endDate.toDate(),
                    comment: reservationData.comment,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email,
                    title: rentalData.title,
                    description: rentalData.description
                  }
                };
                // return sendgridemail.send(msgbody);
                return true;
              })
              .then(() => console.log('reservation mail sent success'))
              .catch(err => console.log(err));
          })
          .then(() => console.log('reservation mail sent success'))
          .catch(err => console.log(err));
      })
      .then(() => console.log('reservation mail sent success'))
      .catch(err => console.log(err));
  });
