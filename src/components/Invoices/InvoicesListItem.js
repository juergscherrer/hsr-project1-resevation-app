import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Moment from 'react-moment';
import { db } from '../../firebase/firebase';
import { withStyles } from '@material-ui/core/styles/index';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  reservations: [],
  isPaid: false
};

const styles = theme => ({});

function InvoiceStatus(props) {
  if (props.isPaid) {
    return <span>Ja</span>;
  }
  return <span>Nein</span>;
}

function PaidAt(props) {
  if (props.reservation.data().paidAt) {
    return (
      <Moment format="YYYY-MM-DD HH:mm:ss">
        {props.reservation.data().paidAt.toDate()}
      </Moment>
    );
  } else {
    return '';
  }
}

class InvoicesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
    this.setState({ reservations: this.props.reservation });
    this.setState({ isPaid: this.props.reservation.isPaid });
  }

  handleChange(reservation, status) {
    let paid = !status;
    this.setState({ isPaid: paid });
    let date = null;

    var reservationRef = db.collection('reservations').doc(reservation.id);

    // set new date only if checkbox is checked
    if (paid === true) {
      date = new Date();
    } else {
      date = null;
    }

    // update status
    return reservationRef
      .update({
        paid: paid,
        paidAt: date
      })
      .then(() => {
        this.props.setMessage('Der Status wurde erfolgreich aktualisiert.');
      })
      .catch(error => {
        this.props.setMessage('Die Aktualisierung ist leider fehlgeschlagen.');
      });
  }

  render() {
    const { classes } = this.props;
    const reservation = this.props.reservation;

    return (
      <TableRow key="99">
        <TableCell component="th" scope="row">
          <Moment format="YYYY-MM-DD">
            {reservation.data().startDate.toDate()}
          </Moment>
        </TableCell>

        <TableCell numeric>
          <Moment format="YYYY-MM-DD">
            {reservation.data().endDate.toDate()}
          </Moment>
        </TableCell>

        <TableCell numeric>{reservation.data().numberOfGuests}</TableCell>

        <TableCell numeric>{reservation.data().comment}</TableCell>

        <TableCell numeric>Total Betrag dynamisch</TableCell>

        <TableCell numeric>
          <PaidAt reservation={reservation} isPaid={this.state.isPaid} />
        </TableCell>

        <TableCell numeric>
          <InvoiceStatus isPaid={this.state.isPaid} />

          <Checkbox
            checked={reservation.data().paid}
            onChange={e =>
              this.handleChange(reservation, reservation.data().paid)
            }
            value="checkedA"
          />
        </TableCell>
      </TableRow>
    );
  }
}

InvoicesListItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoicesListItem);
