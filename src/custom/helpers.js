import firebase from 'firebase/app';
import 'firebase/firestore';

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
/* eslint-disable */
Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
/* eslint-enable */
export function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
