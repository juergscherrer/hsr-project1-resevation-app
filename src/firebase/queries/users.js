import { db } from '../index';

// get User with userId
export async function getUser(userId) {
  return await db
    .collection('users')
    .doc(userId)
    .get();
}
