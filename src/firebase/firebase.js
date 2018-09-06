import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyC1kJrbckR4gYohsOZgBxBtXJbiDXbiSkQ",
    authDomain: "drogerie-app.firebaseapp.com",
    databaseURL: "https://drogerie-app.firebaseio.com",
    projectId: "drogerie-app",
    storageBucket: "drogerie-app.appspot.com",
    messagingSenderId: "684933070871"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
    db,
    auth,
};