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
    db.ref('users').child(id).once('value');


// Rentals API

export const doCreateRental = (title, description, priceForGuest, priceForOwner, deleted = false) =>
    db.ref(`rentals`).push({
        title,
        description,
        priceForGuest,
        priceForOwner,
        deleted,
    });

export const getRentals = () =>
    db.ref('rentals');


export const editRental = (id, title, description, priceForGuest, priceForOwner, deleted) =>
    db.ref(`rentals/${id}`).set({
        title,
        description,
        priceForGuest,
        priceForOwner,
        deleted,
});


// RentalsUsers API

// export const doCreateRentalUser = (isManager, isOwner, rentalId, userId, deleted = false) =>
//     db.ref(`rentalsUsers`).push({
//         isManager,
//         isOwner,
//         rentalId,
//         userId,
//         deleted,
//     });
//
// export const getRentalsUsers = (userId) =>
//     db.ref('rentalsUsers').orderByChild('userId').equalTo(userId);


// UserRentals

export const doCreateUserRental = (isManager, isOwner, rentalId, userId) =>
    db.ref(`userRentals/${userId}/${rentalId}/`).set({
        isManager,
        isOwner,
    });


export const getUserRentals = (userId) =>
    db.ref('userRentals').child(userId);
