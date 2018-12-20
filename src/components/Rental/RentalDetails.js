import React from 'react';
import RentalForm from './RentalForm';
import RentalUsersList from './RentalUsersList';
import AlertDialog from '../AlertDialog';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import UserIcon from '@material-ui/icons/People';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import { deleteRental } from '../../firebase/queries/rentals';
import {
  deleteUserRental,
  getUserRentalsWithRentalOnce
} from '../../firebase/queries/userRentals';

const styles = theme => ({
  topButtons: {
    paddingLeft: `${theme.spacing.unit * 3}px`,
    paddingRight: `${theme.spacing.unit * 3}px`
  },
  button: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  link: {
    textDecoration: 'none'
  }
});

const INITIAL_STATE = {
  rentalId: null,
  showRentalUsers: false,
  showRentalForm: false,
  deleteButtonDisabled: false,
  openAlertDialog: false,
  alertDialogtext: null
};

class RentalDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.toggleRentalForm = this.toggleRentalForm.bind(this);
    this.toggleRentalUsers = this.toggleRentalUsers.bind(this);
    this.deleteRental = this.deleteRental.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    if (this.props.rentalId) {
      this.setState({
        rentalId: this.props.rentalId
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.rentalId !== prevProps.rentalId) {
      this.setState({
        rentalId: this.props.rentalId
      });
    }
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
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

  handleDelete() {
    const text = 'Mietobjekt wirklich entfernen?';
    this.setState({ openAlertDialog: true, alertDialogtext: text });
  }

  handleAnswer = answer => {
    if (answer) {
      this.deleteRental();
    } else {
      this.setState({ openAlertDialog: false, alertDialogtext: null });
    }
  };

  deleteRental() {
    deleteRental(this.props.rentalId)
      .then(() => {
        this.deleteUserRental();
      })
      .catch(error => {
        this.props.setMessage(
          `Rental konnte nicht gelöscht werden. Fehlermeldung: ${error}`
        );
      });
  }

  deleteUserRental() {
    const userRentalsRef = getUserRentalsWithRentalOnce(this.props.rentalId);

    userRentalsRef.then(userRentals => {
      userRentals.forEach(userRental => {
        deleteUserRental(userRental)
          .then(() => {
            this.props.closeDetails();
            this.props.setMessage('Rental wurde erfolgreich gelöscht.');
          })
          .catch(error => {
            this.props.setMessage(
              `User Rental konnte nicht gelöscht werden. Fehlermeldung: ${error}`
            );
          });
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { rentalId } = this.state;

    return (
      <div>
        <div className={classes.topButtons}>
          <Link className={classes.link} to={`/reservations/${rentalId}`}>
            <Button variant="outlined" size="small" className={classes.button}>
              <CalendarIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              Kalender
            </Button>
          </Link>

          <Button
            onClick={this.toggleRentalUsers}
            variant="outlined"
            size="small"
            className={classes.button}
            color={this.state.showRentalUsers ? 'secondary' : 'default'}
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
            color={this.state.showRentalForm ? 'secondary' : 'default'}
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
            onClick={this.handleDelete}
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
            <RentalForm
              handleClick={this.toggleRentalForm}
              rentalId={rentalId}
              setMessage={this.props.setMessage}
            />
          )}
        </div>
        {this.state.showRentalUsers && (
          <RentalUsersList
            rentalId={rentalId}
            setMessage={this.props.setMessage}
          />
        )}
        <AlertDialog
          open={this.state.openAlertDialog}
          text={this.state.alertDialogtext}
          handleAnswer={this.handleAnswer}
        />
      </div>
    );
  }
}

export default withStyles(styles)(RentalDetails);
