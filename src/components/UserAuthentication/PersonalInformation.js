import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles/index';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db, auth } from '../../firebase';
import * as firebase from 'firebase';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  submit: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 3
  }
});

const INITIAL_STATE = {
  user: {},
  emailChanged: false
};

class PersonalInformationForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
  }

  componentDidMount() {
    // Updating the `users` local state attribute when the Firebase Realtime Database data
    // under the '/users' path changes.

    db.collection('users')
      .doc(auth.currentUser().uid)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      });
  }

  handleChange(event) {
    var user = { ...this.state.user };
    user[event.target.name] = event.target.value;

    this.setState({ user: user });

    if (event.target.name === 'email') {
      this.setState({ emailChanged: true });
    }
  }

  onSubmit = event => {
    event.preventDefault();

    // check if email has changed
    if (this.state.emailChanged) {
      // update email in firebase auth
      var currentUser = firebase.auth().currentUser;

      currentUser
        .updateEmail(this.state.user.email)
        .then(() => {
          this.updateUserData();
        })
        .catch(error => {
          this.props.setMessage(error.message);
        });
    } else {
      this.updateUserData();
    }
  };

  updateUserData() {
    let user = { ...this.state.user };

    db.collection('users')
      .doc(auth.currentUser().uid)
      .set(user)
      .then(() => {
        // Update successful.
        this.props.setMessage('Änderungen erfolgreich gespeichert.');
      })
      .catch(error => {
        // An error happened.
        this.props.setMessage(error.message);
      });
  }

  render() {
    const { classes } = this.props;
    const { firstname, lastname, email } = this.state.user;
    const isInvalid = firstname === '' || lastname === '' || email === '';

    return (
      <React.Fragment>
        <form className={classes.form} onSubmit={this.onSubmit}>
          <TextField
            id="firstname"
            label="Vorname"
            name="firstname"
            className={classes.textField}
            value={this.state.user.firstname || ''}
            margin="normal"
            onChange={this.handleChange}
            fullWidth
            required
          />
          <TextField
            id="lastname"
            label="Nachname"
            name="lastname"
            className={classes.textField}
            value={this.state.user.lastname || ''}
            margin="normal"
            onChange={this.handleChange}
            fullWidth
            required
          />
          <TextField
            id="email"
            label="E-Mail"
            name="email"
            className={classes.textField}
            value={this.state.user.email || ''}
            margin="normal"
            onChange={this.handleChange}
            fullWidth
            required
          />
          <Button
            variant="raised"
            color="primary"
            className={classes.submit}
            disabled={isInvalid}
            type="submit"
          >
            Speichern
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

PersonalInformationForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(PersonalInformationForm));
