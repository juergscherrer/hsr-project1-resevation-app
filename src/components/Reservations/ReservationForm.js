import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { bookedDates, formatDate } from '../../custom/helpers';
import {
  getBookedDatesWithRental,
  getBookedDatesWithReservation,
  deleteBookedDate,
  createBookedDate
} from '../../firebase/queries/bookedDates';
import {
  createReservation,
  deleteReservation,
  getReservation,
  updateReservation
} from '../../firebase/queries/reservations';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RenewIcon from '@material-ui/icons/Autorenew';
import DeleteIcon from '@material-ui/icons/Delete';

import { auth } from '../../firebase/index';

import firebase from 'firebase/app';
import 'firebase/firestore';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },

  submit: {
    marginTop: theme.spacing.unit * 3
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  formControl: {
    margin: theme.spacing.unit
  },

  button: {
    margin: theme.spacing.unit
  },

  leftIcon: {
    marginRight: theme.spacing.unit
  },

  iconSmall: {
    fontSize: 20
  }
});

const INITIAL_STATE = {
  reservationId: null,
  startDate: '',
  endDate: '',
  numberOfGuests: '',
  comment: ''
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class ReservationForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate(prevProps) {
    if (this.props.newReservation !== prevProps.newReservation) {
      this.setState({
        reservationId: null,
        startDate: formatDate(this.props.newReservation.start),
        endDate: formatDate(this.props.newReservation.end)
      });
    } else if (
      this.props.editReservationId &&
      this.props.editReservationId !== prevProps.editReservationId
    ) {
      this.getExistingReservation(this.props.editReservationId).catch(error => {
        this.props.setMessage(
          `Reservation konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getExistingReservation = async editReservationId => {
    const reservation = await getReservation(editReservationId);
    if (reservation && reservation.data().userId === auth.currentUser().uid) {
      this.setState({
        reservationId: reservation.id,
        startDate: formatDate(reservation.data().startDate.toDate()),
        endDate: formatDate(reservation.data().endDate.toDate()),
        numberOfGuests: reservation.data().numberOfGuests,
        comment: reservation.data().comment
      });
    } else {
      this.props.setMessage('Reservation kann nicht bearbeitet werden.');
      this.clearForm();
    }
  };

  onSubmit = async event => {
    const {
      reservationId,
      startDate,
      endDate,
      numberOfGuests,
      comment
    } = this.state;

    this.validateBookingDates(
      startDate,
      endDate,
      Number(numberOfGuests),
      comment,
      reservationId
    );

    event.preventDefault();
  };

  validateBookingDates = async (
    startDate,
    endDate,
    numberOfGuests,
    comment,
    reservationId
  ) => {
    const bDates = bookedDates(new Date(startDate), new Date(endDate));
    let promiseArr = [];

    for (let bDate of bDates) {
      promiseArr = [
        ...promiseArr,
        getBookedDatesWithRental(bDate, this.props.rentalId)
      ];
    }

    const datesRefs = await Promise.all(promiseArr);

    let isValid = true;
    for (let bDate of bDates) {
      for (let datesRef of datesRefs) {
        if (!datesRef.empty) {
          /* eslint-disable */
          datesRef.forEach(doc => {
            if (
              doc.data().date.seconds === bDate.date.seconds &&
              doc.data().reservationId !== reservationId
            ) {
              isValid =
                isValid &&
                ((doc.data().startDate && bDate.endDate) ||
                  (doc.data().endDate && bDate.startDate));
            }
          });
          /* eslint-enable */
        }
      }
    }

    if (isValid) {
      reservationId
        ? this.editReservation(
            reservationId,
            startDate,
            endDate,
            Number(numberOfGuests),
            comment
          )
        : this.newReservation(
            startDate,
            endDate,
            Number(numberOfGuests),
            comment
          );
    } else {
      this.props.setMessage(
        'Reservation fehlgeschlagen, bitte die eingegebenen Daten überprüfen.'
      );
    }
  };

  newReservation = (startDate, endDate, numberOfGuests, comment) => {
    const reservationRef = createReservation({
      startDate: firebase.firestore.Timestamp.fromDate(new Date(startDate)),
      endDate: firebase.firestore.Timestamp.fromDate(new Date(endDate)),
      numberOfGuests,
      comment,
      userId: auth.currentUser().uid,
      rentalId: this.props.rentalId,
      paidAt: null,
      paid: false
    });
    return reservationRef
      .then(reservation => {
        this.manageBookedDates(
          bookedDates(new Date(startDate), new Date(endDate)),
          reservation.id
        );
        this.props.setMessage(' Reservation wurde erfolgreich erstellt.');
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.props.setMessage(
          `Reservation konnte nicht erstellt werden. Fehlermeldung: ${error}`
        );
      });
  };

  editReservation = (
    reservationId,
    startDate,
    endDate,
    numberOfGuests,
    comment
  ) => {
    const reservationData = {
      startDate: firebase.firestore.Timestamp.fromDate(new Date(startDate)),
      endDate: firebase.firestore.Timestamp.fromDate(new Date(endDate)),
      numberOfGuests,
      comment
    };
    const reservationRef = updateReservation(reservationId, reservationData);
    return reservationRef
      .then(() => {
        this.manageBookedDates(
          bookedDates(new Date(startDate), new Date(endDate)),
          reservationId
        );
        this.props.setMessage(' Reservation wurde erfolgreich aktualisiert.');
        this.clearForm();
      })
      .catch(error => {
        this.props.setMessage(
          `Reservation konnte nicht aktualisiert werden. Fehlermeldung: ${error}`
        );
      });
  };

  deleteReservation = () => {
    const reservationRef = deleteReservation(this.state.reservationId);
    return reservationRef
      .then(() => {
        this.manageBookedDates(null, this.state.reservationId);
        this.props.setMessage(' Reservation wurde erfolgreich gelöscht.');
        this.clearForm();
      })
      .catch(error => {
        this.props.setMessage(
          `Reservation konnte nicht gelöscht werden. Fehlermeldung: ${error}`
        );
      });
  };

  manageBookedDates = (dates, reservationId) => {
    getBookedDatesWithReservation(reservationId)
      .then(bookedDates => {
        bookedDates.forEach(bookedDate => {
          deleteBookedDate(bookedDate).catch(error => {
            this.props.setMessage(
              `BookedDate konnte nicht gelöscht werden. Fehlermeldung: ${error}`
            );
          });
        });
      })
      .then(() => {
        if (dates) {
          for (let date of dates) {
            date['rentalId'] = this.props.rentalId;
            date['reservationId'] = reservationId;
            createBookedDate(date).catch(error => {
              this.props.setMessage(
                `BookedDate konnte nicht gespeichert werden. Fehlermeldung: ${error}`
              );
            });
          }
        }
      });
  };

  clearForm = () => {
    this.props.clearEditReservation();
    this.setState({ ...INITIAL_STATE });
  };

  render() {
    const { classes } = this.props;
    const { startDate, endDate, numberOfGuests, comment } = this.state;
    const today = formatDate(Date.now());
    const isInvalid =
      startDate === '' ||
      startDate < today ||
      endDate === '' ||
      endDate < today ||
      numberOfGuests === '' ||
      startDate >= endDate;

    return (
      <React.Fragment>
        <div className={classes.header} />
        <form className={classes.form} onSubmit={this.onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="startDate"
              type="date"
              label="Von"
              value={startDate}
              onChange={event =>
                this.setState(byPropKey('startDate', event.target.value))
              }
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="endDate"
              type="date"
              label="Bis"
              value={endDate}
              onChange={event =>
                this.setState(byPropKey('endDate', event.target.value))
              }
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="numberOfGuests"
              type="number"
              label="Anzahl Personen"
              value={numberOfGuests}
              inputProps={{ min: '0', max: '10' }}
              onChange={event =>
                this.setState(byPropKey('numberOfGuests', event.target.value))
              }
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="comment"
              type="text"
              label="Kommentar"
              value={comment}
              onChange={event =>
                this.setState(byPropKey('comment', event.target.value))
              }
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <Button
            className={classes.button}
            color="primary"
            disabled={isInvalid}
            type="submit"
            variant="raised"
          >
            {this.props.editReservationId ? (
              <RenewIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
            ) : (
              <SaveIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
            )}
            {this.props.editReservationId ? 'Aktualisieren' : 'Speichern'}
          </Button>
          {this.props.editReservationId && (
            <React.Fragment>
              <Button
                className={classes.button}
                color="secondary"
                disabled={isInvalid}
                variant="raised"
                onClick={this.deleteReservation}
              >
                <DeleteIcon
                  className={classNames(classes.leftIcon, classes.iconSmall)}
                />
                Löschen
              </Button>
              <Button
                className={classes.button}
                disabled={isInvalid}
                variant="raised"
                onClick={this.clearForm}
              >
                Abbrechen
              </Button>
            </React.Fragment>
          )}
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(ReservationForm));
