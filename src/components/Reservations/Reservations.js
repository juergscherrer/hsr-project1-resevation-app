import React from 'react';
import { getReservations } from '../../firebase/queries/reservations';
import Calendar from './Calendar';
import ReservationForm from './ReservationForm';
import MessageBox from '../MessageBox';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withAuthorization from '../UserAuthentication/withAuthorization';
import { getRental } from '../../firebase/queries/rentals';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  content: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  }
});

const INITIAL_STATE = {
  rentalId: null,
  rental: null,
  reservations: [],
  message: null,
  newReservation: null,
  editReservationId: null
};

class Reservations extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.unsubscribeReservations = null;
    this.unsubscribeRental = null;
  }

  componentDidMount() {
    this.setState({ rentalId: this.props.match.params.rentalId });
    this.getReservations(this.props.match.params.rentalId).catch(error => {
      this.props.setMessage(
        `Reservationen konnten nicht geladen werden. Fehlermeldung: ${error}`
      );
    });
    this.getRental(this.props.match.params.rentalId).catch(error => {
      this.props.setMessage(
        `Mietobjekt konnten nicht geladen werden. Fehlermeldung: ${error}`
      );
    });
  }

  componentWillUnmount() {
    this.unsubscriber();
    this.setState({ ...INITIAL_STATE });
  }

  unsubscriber = () => {
    this.unsubscribeReservations && this.unsubscribeReservations();
    this.unsubscribeRental && this.unsubscribeRental();
  };

  getReservations = async rentalId => {
    const reservationsRef = await getReservations(rentalId);
    const reservationsSnap = reservationsRef.onSnapshot(reservations => {
      this.setState({ reservations: reservations.docs });
    });
    this.unsubscribeReservations = reservationsSnap;
    return reservationsSnap;
  };

  getRental = async rentalId => {
    const rentalRef = await getRental(rentalId);
    const rentalSnap = rentalRef.onSnapshot(rental => {
      this.setState({ rental: rental.data() });
    });
    this.unsubscribeRental = rentalSnap;
    return rentalSnap;
  };

  setMessage = msg => {
    this.setState({ message: msg });
  };

  deleteMessage = () => {
    this.setState({ message: null });
  };

  editSelectedReservation = reservation => {
    this.setState({ editReservationId: reservation.reservationId });
  };

  newSelectedReservation = reservation => {
    this.setState({ newReservation: reservation, editReservationId: null });
  };

  clearEditReservation = () => {
    this.setState({ editReservationId: null });
  };

  render() {
    const { classes } = this.props;
    const { rental, reservations } = this.state;

    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={8}
        >
          <Grid item xs={12} sm={3} display="flex">
            <Paper className={classes.paper}>
              <div className={classes.header}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="headline">
                      {this.state.editReservationId
                        ? 'Reservation bearbeiten'
                        : 'Neue Reservation erstellen'}
                    </Typography>
                  </Grid>
                  <Grid item />
                </Grid>
              </div>

              <div className={classes.content}>
                <ReservationForm
                  rentalId={this.state.rentalId}
                  setMessage={this.setMessage}
                  newReservation={this.state.newReservation}
                  editReservationId={this.state.editReservationId}
                  clearEditReservation={this.clearEditReservation}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9} display="flex">
            <Paper className={classes.paper}>
              <div className={classes.header}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="headline">
                      {rental ? `Kalender ${rental.title}` : 'Kalender'}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div className={classes.content}>
                <Calendar
                  reservations={reservations}
                  setMessage={this.setMessage}
                  editSelectedReservation={this.editSelectedReservation}
                  newSelectedReservation={this.newSelectedReservation}
                  initDate={this.props.match.params.date}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
        <MessageBox
          open={!!this.state.message}
          message={this.state.message}
          onClose={this.deleteMessage}
        />
      </React.Fragment>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(
  withStyles(styles)(Reservations)
);
