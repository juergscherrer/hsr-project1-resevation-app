import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../firebase';
import InvoicesListItem from './InvoicesListItem';

import { withStyles } from '@material-ui/core/styles/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { getUserRentalsWithUserAndManagerOnce } from '../../firebase/queries/userRentals';
import { getReservationsOnce } from '../../firebase/queries/reservations';

const INITIAL_STATE = {
  reservations: []
};

const styles = theme => ({
  table: {
    minWidth: 700
  }
});

class InvoicesList extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.getUserRentals();
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getUserRentals = () => {
    // Get all userRentals where userId is currentUser and manager is true
    const userRentalsRef = getUserRentalsWithUserAndManagerOnce(
      auth.currentUser().uid
    );
    userRentalsRef
      .then(userRentals => {
        // Loop all userRentals and find the reservation
        userRentals.forEach(userRental => {
          const reservationsRef = getReservationsOnce(
            userRental.data().rentalId
          );

          reservationsRef
            .then(reservations => {
              reservations.forEach(reservation => {
                this.setState({
                  reservations: [...this.state.reservations, reservation]
                });
              });
            })
            .catch(function(error) {
              console.log('Error getting documents: ', error);
            });
        });
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  };

  render() {
    const { classes } = this.props;
    const { reservations } = this.state;

    let output = (
      <React.Fragment>
        {reservations.map((reservation, index) => (
          <InvoicesListItem
            reservation={reservation}
            key={index}
            setMessage={this.props.setMessage}
          />
        ))}
      </React.Fragment>
    );

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Mieter</TableCell>
            <TableCell align="center">Objekt</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">End Datum</TableCell>
            <TableCell align="center">Total [CHF]</TableCell>
            <TableCell align="center">Bezahlt am</TableCell>
            <TableCell align="center">Bezahlt?</TableCell>
            <TableCell align="center">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{output}</TableBody>
      </Table>
    );
  }
}

InvoicesList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoicesList);
