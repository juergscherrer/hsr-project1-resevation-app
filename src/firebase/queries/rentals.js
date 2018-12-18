import { db } from '../index';

// get rental with rentalId
export async function getRental(rentalId) {
  return await db.collection('rentals').doc(rentalId);
}

// create new Rental with rentalData
export async function createRental(rentalData) {
  return await db.collection('rentals').add(rentalData);
}

// update rental with rentalId
export async function updateRental(rentalId, rentalData) {
  return await db
    .collection('rentals')
    .doc(rentalId)
    .update(rentalData);
}

// delete rental with rentalId
export async function deleteRental(rentalId) {
  return await db
    .collection('rentals')
    .doc(rentalId)
    .delete();
}
