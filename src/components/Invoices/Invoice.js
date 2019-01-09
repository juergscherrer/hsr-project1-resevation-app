import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import Moment from 'react-moment';

import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withAuthorization from '../UserAuthentication/withAuthorization';
import { getUserRentalsWithRentalAndUser } from '../../firebase/queries/userRentals';
import { getUser } from '../../firebase/queries/users';
import { getRental } from '../../firebase/queries/rentals';
import { getReservationRealtime } from '../../firebase/queries/reservations';

const styles = theme => ({
  link: {
    textDecoration: 'none'
  },
  paper: {
    marginTop: theme.spacing.unit,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    display: 'flex',
    flexDirection: 'column'
  },
  layout: {
    maxWidth: 1280,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
});

const INITIAL_STATE = {
  rental: null,
  reservation: null,
  nights: null,
  user: null,
  userRental: null
};

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.unsubscribeReservation = null;
    this.unsubscribeRental = null;
    this.unsubscribeUser = null;
    this.unsubscribeUserRentals = null;
  }

  componentDidMount() {
    this.getReservation().catch(error => {});
  }

  componentWillUnmount() {
    this.unsubscriber();
    this.setState({ ...INITIAL_STATE });
  }

  unsubscriber = () => {
    this.unsubscribeReservation && this.unsubscribeReservation();
    this.unsubscribeRental && this.unsubscribeRental();
    this.unsubscribeUser && this.unsubscribeUser();
    this.unsubscribeUserRentals && this.unsubscribeUserRentals();
  };

  getReservation = async () => {
    const reservationId = this.props.match.params.reservationId;
    const reservationRef = await getReservationRealtime(reservationId);
    const reservationSnap = reservationRef.onSnapshot(reservation => {
      this.setState({ reservation: reservation.data() }, () =>
        this.getData(reservation.data())
      );
    });

    this.unsubscribeReservation = reservationSnap;
    return reservationSnap;
  };

  getData = reservationData => {
    this.getRental(reservationData).catch(error => {});
    this.getUserRental(reservationData).catch(error => {});
    this.getUser(reservationData).catch(error => {});
  };

  getRental = async reservationData => {
    const rentalRef = await getRental(reservationData.rentalId);
    const rentalSnap = rentalRef.onSnapshot(rental => {
      this.setState({ rental: rental.data() });
    });
    this.unsubscribeRental = rentalSnap;
    return rentalSnap;
  };

  getUserRental = async reservationData => {
    const userId = reservationData.userId;
    const rentalId = reservationData.rentalId;
    const userRentalsRef = await getUserRentalsWithRentalAndUser(
      rentalId,
      userId
    );
    const userRentalsSnap = userRentalsRef.onSnapshot(userRentals => {
      if (!userRentals.empty) {
        this.setState({ userRental: userRentals.docs[0].data() });
      }
    });

    this.unsubscribeUserRentals = userRentalsSnap;
    return userRentalsSnap;
  };

  getUser = async reservationData => {
    const userId = reservationData.userId;
    const userRef = await getUser(userId);
    const userSnap = userRef.onSnapshot(user => {
      this.setState({ user: user.data() });
    });

    this.unsubscribeUser = userSnap;
    return userSnap;
  };

  render() {
    const { classes } = this.props;
    const { reservation, rental, userRental, user } = this.state;
    let invoice = null;

    if (reservation && rental && user) {
      // Calculate total days
      let a = moment(reservation.endDate.toDate());
      let b = moment(reservation.startDate.toDate());
      const nights = a.diff(b, 'days');

      // Calculate price
      let total = '';
      let totalPerNight = '';

      if (userRental && userRental.owner === true) {
        // price owner * days * guests
        total = rental.priceForOwner * nights * reservation.numberOfGuests;
        totalPerNight = rental.priceForOwner * reservation.numberOfGuests;
      } else {
        // price guest * days * guests
        total = rental.priceForGuest * nights * reservation.numberOfGuests;
        totalPerNight = rental.priceForGuest * reservation.numberOfGuests;
      }

      invoice = (
        <div>
          <h1 className={classes.header}>
            Rechnung für {rental.title} {rental.description}
          </h1>

          <p>
            Empfänger: {user.firstname} {user.lastname}
          </p>
          <p> Kommentar: {reservation.comment}</p>
          <p>
            Start:&nbsp;
            <Moment format="DD.MM.YYYY">
              {reservation.startDate.toDate()}
            </Moment>
          </p>
          <p>
            Ende:&nbsp;
            <Moment format="DD.MM.YYYY">{reservation.endDate.toDate()}</Moment>
          </p>
          <p>Anzahl Gäste: {reservation.numberOfGuests}</p>
          <p>Anzahl Nächte: {nights}</p>
          <p>Total pro Nacht: {totalPerNight} Fr.</p>
          <p>Total: {total} Fr.</p>
        </div>
      );
    }

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          {invoice}
          <br />
          <Link className={classes.link} to="/invoices">
            <Button variant="outlined" size="small" className={classes.button}>
              Zurück
            </Button>
          </Link>
        </Paper>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

Invoice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuthorization(authCondition)(withStyles(styles)(Invoice));
