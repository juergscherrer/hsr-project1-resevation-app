import React from 'react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

import MessageBox from '../MessageBox';

import { withStyles } from '@material-ui/core/styles';
import { auth, db } from '../../firebase';

moment.locale('de', {
  week: {
    dow: 1 //Monday is the first day of the week.
  },
  months: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ],
  weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
});

const localizer = BigCalendar.momentLocalizer(moment);

const messages = {
  allDay: 'Ganzer Tag',
  previous: 'Monat zurück',
  next: 'Monat vor',
  today: 'Heute',
  month: 'Monat',
  week: 'Woche',
  day: 'Tag',
  agenda: 'Reservationsliste',
  date: 'Datum',
  time: 'Zeit',
  event: 'Reservation',
  showMore: total => `+ Mehr anzeigen (${total})`
};

const styles = theme => ({});

const INITIAL_STATE = {
  message: null,
  calendarEntries: []
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.loadReservations = this.loadReservations.bind(this);
  }

  componentDidMount() {
    this.loadReservations();
  }

  componentDidUpdate(prevProps) {
    if (this.props.reservations !== prevProps.reservations) {
      this.setState({ calendarEntries: [] });
      this.loadReservations();
    }
  }

  loadReservations() {
    const { reservations } = this.props;

    for (let reservation of reservations) {
      const userRef = db.collection('users').doc(reservation.data().userId);

      userRef
        .get()
        .then(user => {
          if (user.exists) {
            let calenderEntry = {};

            calenderEntry['start'] = reservation.data().startDate.toDate();
            calenderEntry['end'] = reservation.data().endDate.toDate();
            calenderEntry['title'] = `${user.data().firstname} ${
              user.data().lastname
            } ${reservation.data().comment &&
              '(' + reservation.data().comment + ')'}`;
            calenderEntry['allDay'] = true;

            this.setState(prevState => ({
              calendarEntries: [...prevState.calendarEntries, calenderEntry]
            }));
          } else {
            console.log('No such document!');
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
        });
    }
  }

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  render() {
    const { classes } = this.props;
    const {} = this.state;

    return (
      <React.Fragment>
        <BigCalendar
          selectable
          messages={messages}
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.calendarEntries}
          style={{ height: '700px' }}
          views={['month']}
          onSelectEvent={event => this.props.editSelectedReservation(event)}
          onSelectSlot={event => this.props.newSelectedReservation(event)}
        />

        <MessageBox
          open={!!this.state.message}
          message={this.state.message}
          onClose={this.deleteMessage}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Calendar);
