import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/CheckCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import { getUserWithEmailOnce } from '../../firebase/queries/users';
import {
  createUserRental,
  getUserRentalsWithRentalAndUserOnce
} from '../../firebase/queries/userRentals';

const styles = theme => ({
  container: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    paddingLeft: `${theme.spacing.unit * 2}px`,
    paddingRight: `${theme.spacing.unit * 2}px`
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

const INITIAL_STATE = {
  user: null,
  emailSearch: ''
};

class RentalUsersSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.addUser = this.addUser.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.saveUserRental = this.saveUserRental.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.rentalId !== prevProps.rentalId) {
      this.setState({ ...INITIAL_STATE });
    }
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  addUser(event) {
    this.setState({ user: null, emailSearch: event.target.value });
    const email = event.target.value;
    getUserWithEmailOnce(email)
      .then(users => {
        users.forEach(doc => {
          this.setState({ user: doc });
        });
      })
      .catch(error => {
        this.props.setMessage(
          `Fehler in der Benutzer Suche. Fehlermeldung: ${error}`
        );
      });
  }

  validateUser(event) {
    if (this.state.user) {
      getUserRentalsWithRentalAndUserOnce(
        this.props.rentalId,
        this.state.user.id
      )
        .then(usersRentals => {
          switch (usersRentals.docs.length) {
            case 0:
              this.saveUserRental();
              break;
            case 1:
              this.props.setMessage('Benutzer ist bereits hinzugefügt.');
              break;
            default:
              this.props.setMessage('Benutzer kann nicht hinzugefügt werden.');
          }
        })
        .catch(error => {
          console.error(error);
          this.props.setMessage(
            `Benutzer Validierung fehlgeschlagen. Fehlermeldung: ${error}`
          );
        });
    } else {
      this.props.setMessage('Benutzer wurde nicht gefunden');
    }
    event.preventDefault();
  }

  saveUserRental() {
    const userRentalRef = createUserRental({
      userId: this.state.user.id,
      rentalId: this.props.rentalId,
      manager: false,
      owner: false
    });

    return userRentalRef
      .then(userRental => {
        this.props.setMessage('Benutzer wurde hinzugefügt');
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.props.setMessage(
          `Benutzer konnte nicht hinzugefügt werden. Fehlermeldung: ${error}`
        );
      });
  }

  render() {
    const { classes } = this.props;
    const { emailSearch, user } = this.state;

    let inputAdornment = '';

    if (user) {
      inputAdornment = <CheckIcon className={classes.icon} color="secondary" />;
    }

    return (
      <React.Fragment>
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={this.validateUser}
        >
          <TextField
            style={{ margin: 8, width: 400 }}
            placeholder="Email Adresse hinzufügen"
            InputLabelProps={{
              shrink: true
            }}
            onChange={event => this.addUser(event)}
            value={emailSearch}
            InputProps={{
              endAdornment: <InputAdornment>{inputAdornment}</InputAdornment>
            }}
          />
          <Button
            variant="fab"
            aria-label="Hinzufügen"
            mini
            className={classes.button}
            type="submit"
            color={'primary'}
          >
            <AddIcon />
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

RentalUsersSearch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RentalUsersSearch);
