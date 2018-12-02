import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import Moment from 'react-moment';

import { db } from '../../firebase/firebase';

import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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
  nights: null
};

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
      });
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  render() {
    const { classes } = this.props;
    let invoice = null;

    if (this.state.reservation && this.state.rental) {
      invoice = (
        <div>
          <h1 className={classes.header}>
            Rechnung für {this.state.rental.description}
          </h1>
          <p> Kommentar: {this.state.reservation.comment}</p>
          <p>
            Start:
            <Moment format="DD.MM.YYYY">
              {this.state.reservation.startDate.toDate()}
            </Moment>
          </p>
          <p>
            Ende:
            <Moment format="DD.MM.YYYY">
              {this.state.reservation.endDate.toDate()}
            </Moment>
          </p>
          <p>Anzahl Gäste: {this.state.reservation.numberOfGuests}</p>
          <p>Anzahl Nächte: {this.state.days}</p>
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

Invoice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Invoice));
