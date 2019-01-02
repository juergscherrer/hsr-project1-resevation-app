import { db } from '../index';
import firebase from 'firebase/app';
import 'firebase/firestore';

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export async function getReservation(reservationId) {
  return await db
    .collection('reservations')
    .doc(reservationId)
    .get();
}

// get Reservations with rentalId
export async function getReservations(rentalId) {
  return await db.collection('reservations').where('rentalId', '==', rentalId);
}

// get Reservations with rentalId and userId
export async function getReservationsWithUserId(rentalId, userId) {
  return await db
    .collection('reservations')
    .where('rentalId', '==', rentalId)
    .where('userId', '==', userId)
    .where('endDate', '>', firebase.firestore.Timestamp.fromDate(yesterday));
}

// create new Reservation with reservationData
export async function createReservation(reservationData) {
  return await db.collection('reservations').add(reservationData);
}

// update reservation with reservationId
export async function updateReservation(reservationId, reservationData) {
  return await db
    .collection('reservations')
    .doc(reservationId)
    .update(reservationData);
}

// delete reservation with reservationId
export async function deleteReservation(reservationId) {
  return await db
    .collection('reservations')
    .doc(reservationId)
    .delete();
}
