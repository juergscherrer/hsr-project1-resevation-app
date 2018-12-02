import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import InvoicesListItem from './InvoicesListItem';
import { db } from '../../firebase/firebase';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { auth } from '../../firebase';

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
    // Get current user
    let currentUser = auth.currentUser().uid;

    // Get all userRentals where userId is currentUser and manager is true
    db.collection('userRentals')
      .where('userId', '==', currentUser)
      .where('manager', '==', true)
      .onSnapshot(userRentals => {
        // Clear state
        this.setState({ ...INITIAL_STATE });

        // Loop all userRentals and find the reservation
        userRentals.forEach(doc => {
          db.collection('reservations')
            .where('rentalId', '==', doc.data().rentalId)
            .onSnapshot(reservations => {
              reservations.forEach(doc => {
                this.setState({
                  reservations: [...this.state.reservations, doc]
                });
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
            <TableCell numeric>Mieter</TableCell>
            <TableCell numeric>Objekt</TableCell>
            <TableCell numeric>Start Date</TableCell>
            <TableCell numeric>End Datum</TableCell>
            <TableCell numeric>Total</TableCell>
            <TableCell numeric>Bezahlt am</TableCell>
            <TableCell numeric>Bezahlt?</TableCell>
            <TableCell numeric>Details</TableCell>
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
