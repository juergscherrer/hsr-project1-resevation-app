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

export const getUser = (id) =>
    db.ref('users').child(id)


// UserRental API
export const newUserRental = (user_id, rental_id, owner, manager, title, description) =>
    db.ref(`user_rentals/${user_id}/${rental_id}`).set({
        title,
        description,
        owner,
        manager
    });

export const getUserRentals = (user_id) =>
    db.ref(`user_rentals/${user_id}`)

export const getUserRental = (user_id, rental_id) =>
    db.ref(`user_rentals/${user_id}/${rental_id}`)

export const editUserRental = (user_id, rental_id, title, description, owner, manager) =>
    db.ref(`user_rentals/${user_id}/${rental_id}`).set({
        title,
        description,
        owner,
        manager
    });

// Rentals API
export const newRental = (title, description, priceForGuest, priceForOwner, deleted = false) =>
    db.ref(`rentals`).push({
        title,
        description,
        priceForGuest,
        priceForOwner,
        deleted,
    });

export const getRental = (id) =>
    db.ref('rentals').child(id);

export const getReservations = () =>
    db.ref('reservations');

export const editRental = (id, title, description, priceForGuest, priceForOwner) =>
    db.ref(`rentals/${id}`).set({
        title,
        description,
        priceForGuest,
        priceForOwner,
});