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
    db.collection('reservations').onSnapshot(reservations => {
      this.setState({ reservations: reservations.docs });
    });
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
            <TableCell numeric>Objekt</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell numeric>End Datum</TableCell>
            <TableCell numeric>Anzahl Gäste</TableCell>
            <TableCell numeric>Anzahl Tage</TableCell>
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
