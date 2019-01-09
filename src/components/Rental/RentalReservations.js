import React, { Component } from 'react';
import { auth } from '../../firebase';
import Moment from 'react-moment';

import { withStyles } from '@material-ui/core/styles/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { getReservationsWithUserId } from '../../firebase/queries/reservations';
import { Link } from 'react-router-dom';
import { formatDate } from '../../custom/helpers';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/RemoveRedEyeOutlined';

const INITIAL_STATE = {
  reservations: []
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  emptyMessage: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  link: {
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing.unit
  }
});

class RentalReservations extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

    this.unsubscribeReservations = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rentalId !== this.props.rentalId) {
      this.unsubscriber();
      this.getReservationsFromUser().catch(error => {
        this.props.setMessage(
          `Reservationen konnten nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.unsubscriber();
    this.setState({ ...INITIAL_STATE });
  }

  unsubscriber = () => {
    this.unsubscribeReservations && this.unsubscribeReservations();
  };

  getReservationsFromUser = async () => {
    const reservationsRef = await getReservationsWithUserId(
      this.props.rentalId,
      auth.currentUser().uid
    );
    const reservationsSnap = reservationsRef.onSnapshot(reservations => {
      this.setState({ reservations: reservations.docs });
    });
    this.unsubscribeReservations = reservationsSnap;
    return reservationsSnap;
  };

  loadReservationContent = () => {
    const { classes } = this.props;
    let content = [];
    if (this.state.reservations) {
      content = this.state.reservations.map((reservation, index) => {
        const dateString = formatDate(reservation.data().startDate.toDate());
        return (
          <TableRow key={index}>
            <TableCell>
              <Moment format="DD.MM.YYYY">
                {reservation.data().startDate.toDate()}
              </Moment>
              {' - '}
              <Moment format="DD.MM.YYYY">
                {reservation.data().endDate.toDate()}
              </Moment>
              <Link
                className={this.props.classes.link}
                to={`/reservations/${this.props.rentalId}/${dateString}`}
              >
                <IconButton
                  className={classes.button}
                  aria-label="Show Reservation"
                >
                  <DeleteIcon />
                </IconButton>
              </Link>
            </TableCell>
            <TableCell>{reservation.data().numberOfGuests}</TableCell>
            <TableCell>{reservation.data().comment}</TableCell>
          </TableRow>
        );
      });
    }
    return content;
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.header}>
          <h3>Meine Reservationen</h3>
        </div>
        {this.state.reservations.length > 0 ? (
          <div className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Datum</TableCell>
                  <TableCell>Personen</TableCell>
                  <TableCell>Kommentar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.loadReservationContent()}</TableBody>
            </Table>
          </div>
        ) : (
          <div className={classes.emptyMessage}>
            <span>Keine neuen Reservationen in Sicht.</span>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(RentalReservations);
