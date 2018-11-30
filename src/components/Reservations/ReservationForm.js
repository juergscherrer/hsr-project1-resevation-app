import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { bookedDates } from '../../custom/helpers';
import { getBookedDate } from '../../firebase/queries/bookedDates';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import { auth, db } from '../../firebase/index';

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
  reservationId: '',
  startDate: '2018-11-20',
  endDate: '2018-11-24',
  numberOfGuests: '4',
  comment: '',
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class ReservationForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  // componentDidMount() {
  //   if (this.props.rentalId) {
  //   }
  // }
  //
  // componentDidUpdate(prevProps) {
  //   if (this.props.rentalId !== prevProps.rentalId) {
  //   }
  // }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

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
    comment
  ) => {
    let valid = true;
    const bDates = bookedDates(new Date(startDate), new Date(endDate));
    let promiseArr = [];

    for (let bDate of bDates) {
      promiseArr = [...promiseArr, getBookedDate(bDate, this.props.rentalId)];
    }

    const datesRefs = await Promise.all(promiseArr);

    console.log(datesRefs);

    for (let bDate of bDates) {
      for (let datesRef of datesRefs) {
        datesRef.forEach(doc => {
          valid =
            (doc.data().startDate && bDate.endDate) ||
            (doc.data().endDate && bDate.startDate);
        });
      }
    }

    console.log(valid);
    if (valid) {
      this.newReservation(startDate, endDate, Number(numberOfGuests), comment);
    } else {
      this.props.setMessage(
        'Reservation fehlgeschlagen, bitte Daten überprüfen.'
      );
    }
  };

  newReservation = (startDate, endDate, numberOfGuests, comment) => {
    db.collection('reservations')
      .add({
        startDate: firebase.firestore.Timestamp.fromDate(new Date(startDate)),
        endDate: firebase.firestore.Timestamp.fromDate(new Date(endDate)),
        numberOfGuests,
        comment,
        userId: auth.currentUser().uid,
        rentalId: this.props.rentalId,
        paidAt: ''
      })
      .then(reservation => {
        this.saveBookedDates(
          bookedDates(new Date(startDate), new Date(endDate))
        );
        this.props.setMessage(' Reservation wurde erfolgreich erstellt.');
        this.state = { ...INITIAL_STATE };
      })
      .catch(error => {
        this.props.setMessage(
          `Reservation konnte nicht erstellt werden. Fehlermeldung: ${error}`
        );
      });
  };

  saveBookedDates = dates => {
    for (let date of dates) {
      date['rentalId'] = this.props.rentalId;
      db.collection('bookedDates')
        .add(date)
        .then(bookedDate => {})
        .catch(error => {
          this.props.setMessage(
            `BookedDate konnte nicht gespeichert werden. Fehlermeldung: ${error}`
          );
        });
    }
  };

  // editReservation = (rentalId, title, description, priceForGuest, priceForOwner) => {
  //     const userRental = db.collection('rentals').doc(rentalId);
  //
  //     return userRental
  //         .update({
  //             title,
  //             description,
  //             priceForGuest,
  //             priceForOwner
  //         })
  //         .then(() => {
  //             this.setState({ ...INITIAL_STATE });
  //             this.props.handleClick();
  //             this.props.setMessage(`${title} wurde erfolgreich aktualisiert.`);
  //         })
  //         .catch(error => {
  //             this.props.setMessage(
  //                 `Mietobjekt konnte nicht aktualisiert werden. Fehlermeldung: ${error}`
  //             );
  //         });
  // };

  render() {
    const { classes } = this.props;
    const { startDate, endDate, numberOfGuests, comment } = this.state;

    const isInvalid =
      startDate === '' ||
      endDate === '' ||
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
            color="primary"
            disabled={isInvalid}
            type="submit"
            fullWidth
            variant="raised"
          >
            <SaveIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Speichern
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(ReservationForm));
