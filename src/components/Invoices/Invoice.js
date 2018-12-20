import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import Moment from 'react-moment';

import { db } from '../../firebase/firebase';

import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withAuthorization from '../UserAuthentication/withAuthorization';

const styles = theme => ({
  link: {
    textDecoration: 'none'
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
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

// Calculate price
var total = null;
var totalPerNight = null;

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  // TODO error handling
  componentDidMount() {
    // get reservation
    db.collection('reservations')
      .doc(this.props.match.params.reservationId)
      .onSnapshot(reservation => {
        this.setState({ reservation: reservation.data() });

        // Calculate total days
        let a = moment(this.state.reservation.endDate.toDate() || null);
        let b = moment(this.state.reservation.startDate.toDate() || null);
        this.setState({ days: a.diff(b, 'days') });

        // get rental
        db.collection('rentals')
          .doc(this.state.reservation.rentalId)
          .onSnapshot(rental => {
            this.setState({ rental: rental.data() });
          });

        // Get user from firestore and store it in local state
        db.collection('userRentals')
          .where('rentalId', '==', this.state.reservation.rentalId)
          .onSnapshot(userRental => {
            userRental.forEach(doc => {
              this.setState({ userRental: doc.data() });

              if (this.state.userRental.owner === true) {
                // price owner * days * guests
                total =
                  this.state.rental.priceForOwner *
                  this.state.days *
                  reservation.data().numberOfGuests;
                totalPerNight = this.state.rental.priceForOwner;
              } else {
                // price guest * days * guests
                total =
                  this.state.rental.priceForGuest *
                  this.state.days *
                  reservation.data().numberOfGuests;
                totalPerNight = this.state.rental.priceForGuest;
              }

              let userId = doc.data().userId;
              db.collection('users')
                .doc(userId)
                .onSnapshot(user => {
                  this.setState({ user: user.data() });
                });
            });
          });
      });
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  render() {
    const { classes } = this.props;
    let invoice = null;

    if (this.state.reservation && this.state.rental && this.state.user) {
      invoice = (
        <div>
          <h1 className={classes.header}>
            Rechnung für {this.state.rental.description}
          </h1>

          <p>
            Empfänger: {this.state.user.firstname} {this.state.user.lastname}
          </p>
          <p> Kommentar: {this.state.reservation.comment}</p>
          <p>
            Start:&nbsp;
            <Moment format="DD.MM.YYYY">
              {this.state.reservation.startDate.toDate()}
            </Moment>
          </p>
          <p>
            Ende:&nbsp;
            <Moment format="DD.MM.YYYY">
              {this.state.reservation.endDate.toDate()}
            </Moment>
          </p>
          <p>Anzahl Gäste: {this.state.reservation.numberOfGuests}</p>
          <p>Anzahl Nächte: {this.state.days}</p>
          <p>Total pro Nacht: {totalPerNight || ''}</p>
          <p>Total: {total || ''}</p>
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
