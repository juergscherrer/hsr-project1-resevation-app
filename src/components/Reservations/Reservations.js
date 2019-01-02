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
  layout: {
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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
  }

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

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
    this._isMounted = false;
    this.setState({ ...INITIAL_STATE });
  }

  getReservations = async rentalId => {
    const reservationsRef = await getReservations(rentalId);
    return reservationsRef.onSnapshot(reservations => {
      if (this._isMounted) {
        this.setState({ reservations: reservations.docs });
      }
    });
  };

  getRental = async rentalId => {
    const rentalRef = await getRental(rentalId);
    return rentalRef.onSnapshot(rental => {
      this.setState({ rental: rental.data() });
    });
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
        <div className={classes.layout}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={24}
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
        </div>
      </React.Fragment>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(
  withStyles(styles)(Reservations)
);
