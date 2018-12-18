import { db } from '../index';

// get user with userId once
export async function getUserOnce(userId) {
  return await db
    .collection('users')
    .doc(userId)
    .get();
}

// get user with userId
export async function getUser(userId) {
  return await db.collection('users').doc(userId);
}

// get users with email once
export async function getUserWithEmailOnce(email) {
  return await db
    .collection('users')
    .where('email', '==', email)
    .get();
}
