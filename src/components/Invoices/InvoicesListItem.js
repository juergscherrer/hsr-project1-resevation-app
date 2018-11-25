import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import * as moment from 'moment';

import { db } from '../../firebase/firebase';

import { withStyles } from '@material-ui/core/styles/index';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { auth } from '../../firebase';

const INITIAL_STATE = {
  isPaid: null,
  rental: {},
  owner: null
};

const styles = theme => ({});

function InvoiceStatus(props) {
  if (props.isPaid) {
    return <span>Ja</span>;
  } else {
    return <span>Nein</span>;
  }
}

function PaidAt(props) {
  if (props.reservation.data().paidAt) {
    return (
      <Moment format="YYYY-MM-DD HH:mm:ss">
        {props.reservation.data().paidAt.toDate()}
      </Moment>
    );
  } else {
    return '';
  }
}

class InvoicesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
    this.setState({ isPaid: this.props.reservation.data().paid });

    let rentalId = this.props.reservation.data().rentalId;

    var docRef = db.collection('rentals').doc(rentalId);

    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({ rental: doc.data() });
        } else {
          // doc.data() will be undefined in this case
          this.props.setMessage('Dokument wurde nicht gefunden.');
        }
      })
      .catch(function(error) {
        this.props.setMessage(
          'Fehler beim laden des Dokumentes aufgetreten:',
          error
        );
      });

    // Get userRental where userId and rentalId
    // We need to know if the user has the owner flag
    db.collection('userRentals')
      .where('userId', '==', auth.currentUser().uid)
      .where('rentalId', '==', rentalId)
      .onSnapshot(userRentals => {
        userRentals.forEach(doc => {
          console.log(doc.data().owner);

          if (doc.data().owner === true) {
            this.setState({ owner: true });
          } else {
            this.setState({ owner: false });
          }
        });
      });
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  handleChange(reservation, status) {
    let paid = !status;
    this.setState({ isPaid: paid });
    let date = null;

    var reservationRef = db.collection('reservations').doc(reservation.id);

    // set new date only if checkbox is checked
    if (paid === true) {
      date = new Date();
    } else {
      date = null;
    }

    // update status
    return reservationRef
      .update({
        paid: paid,
        paidAt: date
      })
      .then(() => {
        this.props.setMessage('Der Status wurde erfolgreich aktualisiert.');
      })
      .catch(error => {
        this.props.setMessage('Die Aktualisierung ist leider fehlgeschlagen.');
      });
  }

  render() {
    const { classes } = this.props;
    const reservation = this.props.reservation;

    // Calculate total days
    let a = moment(reservation.data().endDate.toDate());
    let b = moment(reservation.data().startDate.toDate());
    const days = a.diff(b, 'days');

    // Calculate price
    let total = null;

    if (this.state.owner === true) {
      // price owner * days * guests
      total =
        this.state.rental.priceForOwner *
        days *
        reservation.data().numberOfGuests;
    } else {
      // price guest * days * guests
      total =
        this.state.rental.priceForGuest *
        days *
        reservation.data().numberOfGuests;
    }

    return (
      <TableRow key={this.props.index}>
        <TableCell numeric>{this.state.rental.description || ''}</TableCell>

        <TableCell component="th" scope="row">
          <Moment format="YYYY-MM-DD">
            {reservation.data().startDate.toDate()}
          </Moment>
        </TableCell>

        <TableCell numeric>
          <Moment format="YYYY-MM-DD">
            {reservation.data().endDate.toDate()}
          </Moment>
        </TableCell>

        <TableCell numeric>{reservation.data().numberOfGuests}</TableCell>

        <TableCell numeric>{days}</TableCell>

        <TableCell numeric>{reservation.data().comment}</TableCell>

        <TableCell numeric>{total}</TableCell>

        <TableCell numeric>
          <PaidAt reservation={reservation} isPaid={this.state.isPaid} />
        </TableCell>

        <TableCell numeric>
          <InvoiceStatus isPaid={this.state.isPaid} />

          <Checkbox
            checked={reservation.data().paid}
            onChange={e =>
              this.handleChange(reservation, reservation.data().paid)
            }
            value="checkedA"
          />
        </TableCell>
      </TableRow>
    );
  }
}

InvoicesListItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoicesListItem);
