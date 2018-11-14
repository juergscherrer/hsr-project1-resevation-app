import React from "react";
import { db } from "../../firebase";
import { auth } from "../../firebase/index";

import RentalForm from "./RentalForm";
import RentalUsersList from "./RentalUsersList";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import UserIcon from "@material-ui/icons/People";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  topButtons: {
    paddingLeft: `${theme.spacing.unit * 3}px`,
    paddingRight: `${theme.spacing.unit * 3}px`
  },
  button: {
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class RentalDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rentalId: props.rentalId,
      showRentalUsers: false,
      showRentalForm: false,
      deleteButtonDisabled: false
    };

    this.toggleRentalForm = this.toggleRentalForm.bind(this);
    this.toggleRentalUsers = this.toggleRentalUsers.bind(this);
    this.deleteRental = this.deleteRental.bind(this);
    this.deleteUserRental = this.deleteUserRental.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.rentalId !== prevProps.rentalId) {
      this.setState({
        rentalId: this.props.rentalId
      });
    }
  }

  toggleRentalForm() {
    this.state.showRentalForm
      ? this.setState({ showRentalForm: false, deleteButtonDisabled: false })
      : this.setState({
          showRentalForm: true,
          showRentalUsers: false,
          deleteButtonDisabled: true
        });
  }

  toggleRentalUsers() {
    this.state.showRentalUsers
      ? this.setState({ showRentalUsers: false, deleteButtonDisabled: false })
      : this.setState({
          showRentalUsers: true,
          showRentalForm: false,
          deleteButtonDisabled: true
        });
  }

  deleteRental() {
    db.collection("rentals")
      .doc(this.props.rentalId)
      .delete()
      .then(() => {
        console.log("Rental successfully deleted!");
        this.deleteUserRental();
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  }

  deleteUserRental() {
    let deletableUserRentals = db
      .collection("userRentals")
      .where("rentalId", "==", this.props.rentalId);
    deletableUserRentals.get().then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        this.props.closeDetails();
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { rentalId } = this.state;

    return (
      <div>
        <div className={classes.topButtons}>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            disabled={true}
          >
            <CalendarIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Kalender
          </Button>
          <Button
            onClick={this.toggleRentalUsers}
            variant="outlined"
            size="small"
            className={classes.button}
            color={this.state.showRentalUsers ? "secondary" : "default"}
          >
            {this.state.showRentalUsers ? (
              <CloseIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
            ) : (
              <UserIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
            )}
            Benutzer
          </Button>
          <Button
            onClick={this.toggleRentalForm}
            variant="outlined"
            size="small"
            className={classes.button}
            color={this.state.showRentalForm ? "secondary" : "default"}
          >
            {this.state.showRentalForm ? (
              <CloseIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
            ) : (
              <EditIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
            )}
            Bearbeiten
          </Button>
          <Button
            onClick={this.deleteRental}
            variant="outlined"
            size="small"
            className={classes.button}
            disabled={this.state.deleteButtonDisabled}
          >
            <DeleteIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Löschen
          </Button>
          {this.state.showRentalForm && (
            <RentalForm handleClick={this.openRentalForm} rentalId={rentalId} />
          )}
        </div>
        {/*<h3>Reservationen</h3>*/}
        {/*<h3>Rechnungen</h3>*/}
        {this.state.showRentalUsers && <RentalUsersList rentalId={rentalId} />}
      </div>
    );
  }
}

export default withStyles(styles)(RentalDetails);
