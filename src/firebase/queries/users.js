import { db } from '../index';

// get all users
export async function getUsers() {
  const snapshot = await db.collection('users').get();
  return await snapshot.docs.map(doc => doc.data());
}

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

// update user with userId
export async function updateUser(userId, userData) {
  return await db
    .collection('users')
    .doc(userId)
    .update(userData);
}

// create new User with userData
export async function createUser(userId, userData) {
  return await db
    .collection('users')
    .doc(userId)
    .set(userData);
}
