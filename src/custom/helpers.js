import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '../firebase';

export function bookedDates(startDate, endDate) {
  let bookedDates = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    let bookedDate = {};
    bookedDate['startDate'] = currentDate.getTime() === startDate.getTime();
    bookedDate['endDate'] = currentDate.getTime() === endDate.getTime();
    bookedDate['date'] = firebase.firestore.Timestamp.fromDate(currentDate);
    bookedDates = [...bookedDates, bookedDate];
    currentDate = currentDate.addDays(1);
  }
  return bookedDates;
}

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
