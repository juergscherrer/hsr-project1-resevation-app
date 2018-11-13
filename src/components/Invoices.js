import React, { Component } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { db } from "../firebase/firebase";
import withAuthorization from "./UserAuthentication/withAuthorization";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  }
});

function InvoiceStatus(props) {
  const isPaid = props.isPaid;
  if (isPaid) {
    return <span>Yes</span>;
  }
  return <span>No</span>;
}

class InvoicesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reservations: []
    };
  }

  state = {
    checkedA: true,
    checkedB: true,
    checkedF: true
  };

  componentDidMount() {
    db.ref("reservations").on("value", reservations => {
      this.setState({ reservations: reservations.val() });
    });
  }

  handleChange(item, status) {
    let bool = !status;

    db.ref("reservations/")
      .child(item)
      .child("invoice")
      .update({
        paid: bool
      });
  }

  render() {
    const { classes } = this.props;
    const { reservations } = this.state;

    let output = (
      <Paper className={classes.root}>
        <h1 className={classes.header}>Invoices</h1>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell numeric>End Date</TableCell>
              <TableCell numeric>Number of Persons</TableCell>
              <TableCell numeric>Comment</TableCell>
              <TableCell numeric>Paid at</TableCell>
              <TableCell numeric>Total</TableCell>
              <TableCell numeric>Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(reservations).map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <Moment format="YYYY-MM-DD">
                    {reservations[item].start_date}
                  </Moment>
                </TableCell>

                <TableCell numeric>
                  <Moment format="YYYY-MM-DD">
                    {reservations[item].end_date}
                  </Moment>
                </TableCell>

                <TableCell numeric>
                  {reservations[item].number_of_persons}
                </TableCell>

                <TableCell numeric>
                  {reservations[item].invoice.comment}
                </TableCell>

                <TableCell numeric>
                  <Moment format="YYYY-MM-DD">
                    {reservations[item].invoice.paid_at}
                  </Moment>
                </TableCell>

                <TableCell numeric>
                  {reservations[item].invoice.total}
                </TableCell>

                <TableCell numeric>
                  <InvoiceStatus isPaid={reservations[item].invoice.paid} />

                  <Checkbox
                    checked={reservations[item].invoice.paid}
                    onChange={e =>
                      this.handleChange(item, reservations[item].invoice.paid)
                    }
                    value="checkedA"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );

    return (
      <div>
        <div>{output}</div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

InvoicesPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuthorization(authCondition)(
  withStyles(styles)(InvoicesPage)
);
