import { db } from '../index';

// get Reservation with reservationId once
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
