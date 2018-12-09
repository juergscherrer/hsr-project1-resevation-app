import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../firebase';

import { db } from '../../firebase/firebase';
import InvoicesListItem from './InvoicesListItem';

import { withStyles } from '@material-ui/core/styles/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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
      .get()
      .then(querySnapshot => {
        // Loop all userRentals and find the reservation
        querySnapshot.forEach(doc => {
          db.collection('reservations')
            .where('rentalId', '==', doc.data().rentalId)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                this.setState({
                  reservations: [...this.state.reservations, doc]
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
            <TableCell numeric>Total [CHF]</TableCell>
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
