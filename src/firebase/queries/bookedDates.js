import { db } from '../index';

// get bookedDates with rentalId
export async function getBookedDatesWithRental(bDate, rentalId) {
  return await db
    .collection('bookedDates')
    .where('rentalId', '==', rentalId)
    .where('date', '==', bDate.date)
    .get();
}

// get bookedDates with reservationId
export async function getBookedDatesWithReservation(reservationId) {
  return await db
    .collection('bookedDates')
    .where('reservationId', '==', reservationId)
    .get();
}

// delete bookedDate with object ref
export async function deleteBookedDate(bookedDate) {
  return await bookedDate.ref.delete();
}

// create new bookedDate with bookedDateData
export async function createBookedDate(bookedDateData) {
  return await db.collection('bookedDates').add(bookedDateData);
}
