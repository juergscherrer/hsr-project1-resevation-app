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
  }
});

class RentalReservations extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rentalId !== this.props.rentalId) {
      this.getReservationsFromUser().catch(error => {
        this.props.setMessage(
          `Reservationen konnten nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getReservationsFromUser = async () => {
    const reservationsRef = await getReservationsWithUserId(
      this.props.rentalId,
      auth.currentUser().uid
    );
    return reservationsRef.onSnapshot(reservations => {
      this.setState({ reservations: reservations.docs });
    });
  };

  loadReservationContent = () => {
    let content = [];
    if (this.state.reservations) {
      content = this.state.reservations.map((reservation, index) => {
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
