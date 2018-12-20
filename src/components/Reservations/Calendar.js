import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { getUserOnce } from '../../firebase/queries/users';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

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

const INITIAL_STATE = {
  message: null,
  calendarEntries: []
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
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

  loadReservations = () => {
    const { reservations } = this.props;

    for (let reservation of reservations) {
      getUserOnce(reservation.data().userId)
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
            calenderEntry['reservationId'] = reservation.id;

            this.setState(prevState => ({
              calendarEntries: [...prevState.calendarEntries, calenderEntry]
            }));
            this.props.setMessage(
              'Reservationen wurden erfolgreich aktualisiert.'
            );
          } else {
            this.props.setMessage('Benutzer wurde nicht gefunden.');
          }
        })
        .catch(error => {
          this.props.setMessage(
            `Benutzer dieser Reservation konnte nicht gefunden werden. Fehlermeldung: ${error}`
          );
        });
    }
  };

  render() {
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
      </React.Fragment>
    );
  }
}

export default Calendar;
