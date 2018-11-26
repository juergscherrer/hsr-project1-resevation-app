import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { db } from '../../firebase/firebase';

import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { auth } from '../../firebase';

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
  reservation: [],
  rental: []
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

        // get rental
        db.collection('rentals')
          .doc(this.state.reservation.rentalId)
          .onSnapshot(rental => {
            this.setState({ rental: rental.data() });
          });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <h1 className={classes.header}>
            Rechnung für {this.state.rental.description}
          </h1>
          <p> Kommentar: {this.state.reservation.comment || ''}</p>
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

export default withRouter(withStyles(styles)(Invoice));
