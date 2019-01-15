import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import * as moment from 'moment';

import { withStyles } from '@material-ui/core/styles/index';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import { getRental } from '../../firebase/queries/rentals';
import { getUser } from '../../firebase/queries/users';
import { updateReservation } from '../../firebase/queries/reservations';
import { getUserRentalsWithRentalAndUser } from '../../firebase/queries/userRentals';
import firebase from 'firebase/app';
import 'firebase/firestore';

const INITIAL_STATE = {
  reservation: null,
  reservationId: null,
  rental: {},
  user: {},
  userRental: null,
  check: null
};

const styles = theme => ({
  link: {
    textDecoration: 'none'
  }
});

class InvoicesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.unsubscribeRental = null;
    this.unsubscribeUser = null;
    this.unsubscribeUserRentals = null;
  }

  componentWillMount() {
    this.setState({
      reservation: this.props.reservation.data(),
      reservationId: this.props.reservation.id
    });
  }

  componentDidMount() {
    this.getRental().catch(error => {
      this.props.setMessage(
        `Rental konnte nicht geladen werden. Fehlermeldung: ${error}`
      );
    });

    this.getUser().catch(error => {
      this.props.setMessage(
        `User konnte nicht geladen werden. Fehlermeldung: ${error}`
      );
    });

    this.getUserRental().catch(error => {
      this.props.setMessage(
        `UserRental konnte nicht geladen werden. Fehlermeldung: ${error}`
      );
    });
  }

  componentWillUnmount() {
    this.unsubscriber();
    this.setState({ ...INITIAL_STATE });
  }

  unsubscriber = () => {
    this.unsubscribeRental && this.unsubscribeRental();
    this.unsubscribeUser && this.unsubscribeUser();
    this.unsubscribeUserRentals && this.unsubscribeUserRentals();
  };

  getRental = async () => {
    // Get rentalId from props
    const rentalId = this.state.reservation.rentalId;
    // Get rental from firestore and store it in local state
    const rentalRef = await getRental(rentalId);
    const rentalSnap = rentalRef.onSnapshot(rental => {
      this.setState({ rental: rental.data() });
    });

    this.unsubscribeRental = rentalSnap;
    return rentalSnap;
  };

  getUser = async () => {
    // Get rentalId from props
    const userId = this.state.reservation.userId;
    // Get rental from firestore and store it in local state
    const userRef = await getUser(userId);
    const userSnap = userRef.onSnapshot(user => {
      this.setState({ user: user.data() });
    });
    this.unsubscribeUser = userSnap;
    return userSnap;
  };

  getUserRental = async () => {
    // Get rentalId from props
    const userId = this.state.reservation.userId;
    const rentalId = this.state.reservation.rentalId;
    // Get rental from firestore and store it in local state
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

  updateReservation = () => {
    let reservationData = this.state.reservation;
    reservationData['paid'] = !this.state.reservation.paid;
    reservationData['paidAt'] = !this.state.reservation.paid
      ? null
      : firebase.firestore.Timestamp.fromDate(new Date());

    const reservationRef = updateReservation(
      this.state.reservationId,
      reservationData
    );
    return reservationRef
      .then(() => {
        this.props.setMessage('Der Status wurde erfolgreich aktualisiert.');
      })
      .catch(error => {
        this.props.setMessage(
          `Die Aktualisierung ist leider fehlgeschlagen. ${error}`
        );
      });
  };

  render() {
    const { classes, key } = this.props;
    const { user, reservation, rental, userRental, reservationId } = this.state;

    // Calculate total days
    let a = moment(reservation.endDate.toDate());
    let b = moment(reservation.startDate.toDate());
    const days = a.diff(b, 'days');

    // Calculate price
    let total = null;

    if (userRental && userRental.owner === true) {
      // price owner * days * guests
      total = rental.priceForOwner * days * reservation.numberOfGuests;
    } else {
      // price guest * days * guests
      total = rental.priceForGuest * days * reservation.numberOfGuests;
    }

    return (
      <TableRow key={key}>
        <TableCell align="center">
          {user.firstname || ''} {user.lastname || ''}
        </TableCell>

        <TableCell align="center">{rental.title || ''}</TableCell>

        <TableCell component="th" scope="row">
          <Moment format="DD.MM.YYYY">{reservation.startDate.toDate()}</Moment>
        </TableCell>

        <TableCell align="center">
          <Moment format="DD.MM.YYYY">{reservation.endDate.toDate()}</Moment>
        </TableCell>

        <TableCell align="center">{total || ''}</TableCell>

        <TableCell align="center">
          {reservation.paid && reservation.paidAt && (
            <Moment format="DD.MM.YYYY HH:mm:ss">
              {reservation.paidAt.toDate()}
            </Moment>
          )}
        </TableCell>

        <TableCell align="right">
          {reservation.paid ? 'Ja' : 'Nein'}
          <Checkbox
            checked={reservation.paid}
            onChange={this.updateReservation}
            value="checkedA"
          />
        </TableCell>

        <TableCell align="center">
          <Link className={classes.link} to={`/invoices/${reservationId}`}>
            <Button variant="outlined" size="small" className={classes.button}>
              Details
            </Button>
          </Link>
        </TableCell>
      </TableRow>
    );
  }
}

InvoicesListItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoicesListItem);
