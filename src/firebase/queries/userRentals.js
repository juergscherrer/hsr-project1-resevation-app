// get bookedDates with reservationId
import { db } from '../index';

// get userRentals with userId
export async function getUserRentalsWithUser(userId) {
  return await db.collection('userRentals').where('userId', '==', userId);
}

// get userRentals with rentalId
export async function getUserRentalsWithRentalOnce(rentalId) {
  return await db
    .collection('userRentals')
    .where('rentalId', '==', rentalId)
    .get();
}

// get userRentals with rentalId and userId
export async function getUserRentalsWithRentalAndUserOnce(rentalId, userId) {
  return await db
    .collection('userRentals')
    .where('rentalId', '==', rentalId)
    .where('userId', '==', userId)
    .get();
}

// get userRentals with rentalId
export async function getUserRentalsWithRental(rentalId) {
  return await db.collection('userRentals').where('rentalId', '==', rentalId);
}

// delete known userRental with object ref
export async function deleteUserRental(userRentalRef) {
  return await userRentalRef.ref.delete();
}

// delete userRental with rentalId
export async function deleteUserRentalWithId(userRentalId) {
  return await db
    .collection('userRentals')
    .doc(userRentalId)
    .delete();
}

// create new userRental with userRentalData
export async function createUserRental(userRentalData) {
  return await db.collection('userRentals').add(userRentalData);
}

// update userRental with userRentalId
export async function updateUserRental(userRentalId, userRentalData) {
  return await db
    .collection('userRentals')
    .doc(userRentalId)
    .update(userRentalData);
}
