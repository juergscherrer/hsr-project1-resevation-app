import { db } from '../index';

export async function getBookedDate(bDate, rentalId) {
  const response = await db
    .collection('bookedDates')
    .where('rentalId', '==', rentalId)
    .where('date', '==', bDate.date)
    .get();

  return response;
}
