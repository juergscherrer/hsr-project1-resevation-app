import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import * as moment from 'moment';

import { db } from '../../firebase/firebase';

import { withStyles } from '@material-ui/core/styles/index';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const INITIAL_STATE = {
  reservation: null,
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

function InvoiceStatus(props) {
  if (props.isPaid) {
    return <span>Ja</span>;
  } else {
    return <span>Nein</span>;
  }
}

function PaidAt(props) {
  console.log(props);

  if (props.reservation.paid === true && props.reservation.paidAt) {
    return (
      <Moment format="DD.MM.YYYY HH:mm">{props.reservation.paidAt}</Moment>
    );
  } else {
    return '';
  }
}

class InvoicesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleChange = this.handleChange.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  componentWillMount() {
    this.setState({ reservation: this.props.reservation.data() });
  }

  componentDidMount() {
    // Get rentalId from props
    let rentalId = this.props.reservation.data().rentalId;

    // Get rental from firestore and store it in local state
    db.collection('rentals')
      .doc(rentalId)
      .onSnapshot(rental => {
        this.setState({ rental: rental.data() });
      });

    // Get userId from props
    let userId = this.props.reservation.data().userId;

    // Get user from firestore and store it in local state
    db.collection('users')
      .doc(userId)
      .onSnapshot(user => {
        this.setState({ user: user.data() });
      });

    // Get userRental where userId and rentalId match
    db.collection('userRentals')
      .where('userId', '==', userId)
      .where('rentalId', '==', rentalId)
      .onSnapshot(userRentals => {
        userRentals.forEach(doc => {
          if (doc) {
            this.setState({ userRental: doc.data() });
          }
        });
      });
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  handleChange(id) {
    this.setState(
      {
        ...this.state,
        reservation: {
          ...this.state.reservation,
          paid: !this.state.reservation.paid
        }
      },
      () => this.updateStatus(id)
    );
  }

  updateStatus(id) {
    var reservationRef = db.collection('reservations').doc(id);

    // set new date only if checkbox is checked
    if (this.state.reservation.paid === true) {
      this.setState({
        reservation: {
          ...this.state.reservation,
          paidAt: new Date()
        }
      });
    } else {
      this.setState({
        reservation: {
          ...this.state.reservation,
          paidAt: this.props.reservation.data().paidAt
        }
      });
    }

    // update status
    return reservationRef
      .update({
        paid: this.state.reservation.paid,
        paidAt: this.state.reservation.paidAt
      })
      .then(() => {
        this.props.setMessage('Der Status wurde erfolgreich aktualisiert.');
      })
      .catch(error => {
        this.props.setMessage('Die Aktualisierung ist leider fehlgeschlagen.');
      });
  }

  render() {
    const { classes, reservation, key } = this.props;

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
      <TableRow key={key}>
        <TableCell numeric>
          {this.state.user.firstname || ''} {this.state.user.lastname || ''}
        </TableCell>

        <TableCell numeric>{this.state.rental.title || ''}</TableCell>

        <TableCell component="th" scope="row">
          <Moment format="DD.MM.YYYY">
            {reservation.data().startDate.toDate()}
          </Moment>
        </TableCell>

        <TableCell numeric>
          <Moment format="DD.MM.YYYY">
            {reservation.data().endDate.toDate()}
          </Moment>
        </TableCell>

        <TableCell numeric>{total || ''}</TableCell>

        <TableCell numeric>
          <PaidAt reservation={this.state.reservation} />
        </TableCell>

        <TableCell numeric>
          <InvoiceStatus isPaid={this.state.reservation.paid} />

          <Checkbox
            checked={this.state.reservation.paid}
            onChange={e => this.handleChange(this.props.reservation.id)}
            value="checkedA"
          />
        </TableCell>

        <TableCell numeric>
          <Link className={classes.link} to={`/invoices/${reservation.id}`}>
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
