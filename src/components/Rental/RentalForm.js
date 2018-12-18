import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import { auth } from '../../firebase/index';
import {
  createRental,
  getRental,
  updateRental
} from '../../firebase/queries/rentals';
import { createUserRental } from '../../firebase/queries/userRentals';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },

  submit: {
    marginTop: theme.spacing.unit * 3
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  formControl: {
    margin: theme.spacing.unit
  },

  button: {
    margin: theme.spacing.unit
  },

  leftIcon: {
    marginRight: theme.spacing.unit
  },

  iconSmall: {
    fontSize: 20
  }
});

const INITIAL_STATE = {
  rentalId: '',
  title: '',
  description: '',
  priceForGuest: '',
  priceForOwner: '',
  message: '',
  openMessageBox: false,
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class RentalForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.rentalId) {
      this.getRental().catch(error => {
        this.props.setMessage(
          `Rental konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.rentalId !== prevProps.rentalId) {
      this.getRental().catch(error => {
        this.props.setMessage(
          `Rental konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getRental = async () => {
    const rentalRef = await getRental(this.props.rentalId);
    return rentalRef.onSnapshot(rental => {
      this.setState({
        rentalId: rental.id,
        title: rental.data().title,
        description: rental.data().description,
        priceForGuest: rental.data().priceForGuest,
        priceForOwner: rental.data().priceForOwner
      });
    });
  };

  onSubmit = event => {
    const {
      rentalId,
      title,
      description,
      priceForGuest,
      priceForOwner
    } = this.state;

    if (rentalId) {
      this.editRental(
        rentalId,
        title,
        description,
        Number(priceForGuest),
        Number(priceForOwner)
      );
    } else {
      this.newRental(
        title,
        description,
        Number(priceForGuest),
        Number(priceForOwner)
      );
    }

    event.preventDefault();
  };

  newRental = (title, description, priceForGuest, priceForOwner) => {
    const rentalRef = createRental({
      title,
      description,
      priceForGuest,
      priceForOwner
    });
    return rentalRef
      .then(rental => {
        const userRentalRef = createUserRental({
          userId: auth.currentUser().uid,
          rentalId: rental.id,
          owner: true,
          manager: true
        });

        return userRentalRef.then(() => {
          this.setState({ ...INITIAL_STATE });
          this.props.handleClick();
          this.props.setMessage(`${title} wurde erfolgreich erstellt.`);
        });
      })
      .catch(function(error) {
        this.props.setMessage(
          `Mietobjekt konnte nicht erstellt werden. Fehlermeldung: ${error}`
        );
      });
  };

  editRental = (rentalId, title, description, priceForGuest, priceForOwner) => {
    const rentalData = { title, description, priceForGuest, priceForOwner };
    const userRentalRef = updateRental(rentalId, rentalData);
    return userRentalRef
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.handleClick();
        this.props.setMessage(`${title} wurde erfolgreich aktualisiert.`);
      })
      .catch(error => {
        this.props.setMessage(
          `Mietobjekt konnte nicht aktualisiert werden. Fehlermeldung: ${error}`
        );
      });
  };

  render() {
    const { classes } = this.props;
    const { title, description, priceForGuest, priceForOwner } = this.state;

    const isInvalid =
      title === '' ||
      description === '' ||
      priceForGuest === '' ||
      priceForOwner === '';

    return (
      <React.Fragment>
        <div className={classes.header}>
          <h3>
            {this.state.rentalId
              ? this.state.title + ' bearbeiten'
              : 'Neues Mietobjekt erstellen'}
          </h3>
        </div>
        <form className={classes.form} onSubmit={this.onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="title">Titel</InputLabel>
            <Input
              id="title"
              value={title}
              onChange={event =>
                this.setState(byPropKey('title', event.target.value))
              }
              autoFocus
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="description">Beschreibung</InputLabel>
            <Input
              id="description"
              value={description}
              onChange={event =>
                this.setState(byPropKey('description', event.target.value))
              }
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="priceForGuest">
              Preis für Gast (pro Nacht)
            </InputLabel>
            <Input
              id="priceForGuest"
              type="number"
              value={priceForGuest}
              onChange={event =>
                this.setState(byPropKey('priceForGuest', event.target.value))
              }
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="priceForOwner">
              Preis für Besitzer (pro Nacht)
            </InputLabel>
            <Input
              id="priceForOwner"
              type="number"
              value={priceForOwner}
              onChange={event =>
                this.setState(byPropKey('priceForOwner', event.target.value))
              }
            />
          </FormControl>
          <Button
            color="primary"
            disabled={isInvalid}
            type="submit"
            fullWidth
            variant="raised"
          >
            <SaveIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Speichern
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(RentalForm));
