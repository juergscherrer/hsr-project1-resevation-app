import { db } from './firebase';

// User API

export const doCreateUser = (id, firstname, lastname, email, admin = true) =>
    db.ref(`users/${id}`).set({
        firstname,
        lastname,
        email,
        admin,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');


export const onceGetUser = (id) =>
    db.ref(`users/${id}`).once('value');