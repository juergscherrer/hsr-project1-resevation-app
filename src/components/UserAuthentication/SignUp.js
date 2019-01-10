import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { auth } from '../../firebase/index';
import Background from '../../img/loginscreen-jaunpassstrasse.jpg';
import MessageBox from '../MessageBox';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import Grid from '@material-ui/core/Grid';
import { createUser } from '../../firebase/queries/users';

const SignUpPage = ({ history }) => (
  <div>
    <SignUpForm history={history} />
  </div>
);

const INITIAL_STATE = {
  firstname: '',
  lastname: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  redirect: false,
  message: null,
  toLogin: false
};

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 10,
    height: '100vh',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  background: {
    backgroundImage: 'url(' + Background + ')',
    backgroundSize: 'cover'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 1
  },
  cancel: {
    marginTop: theme.spacing.unit * 3,
    margin: theme.spacing.unit
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main
  }
});

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class SignUpFormWithoutStyles extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  handleCancelSubmit() {
    this.setState({
      toLogin: true
    });
  }

  onSubmit = event => {
    const { firstname, lastname, email, passwordOne } = this.state;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        const userData = {
          admin: false,
          email,
          firstname,
          lastname
        };
        createUser(auth.currentUser().uid, userData)
          .then(() => {
            this.setState({
              redirect: true
            });
          })
          .catch(function(error) {
            console.error(
              'Benutzer konnte nicht erstellt werden. Fehlermeldung: ',
              error
            );
          });
      })

      .catch(error => {
        this.setState(byPropKey('error', error));
        this.setState(byPropKey('message', error.message));
        this.setState(byPropKey('open', true));
      });

    event.preventDefault();
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  render() {
    const { classes } = this.props;
    const { firstname, lastname, email, passwordOne, passwordTwo } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstname === '' ||
      lastname === '';

    if (this.state.toLogin === true) {
      return <Redirect to="/" />;
    }

    return (
      <main className={classes.background}>
        <section className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AssignmentInd />
            </Avatar>
            <Typography variant="h5">Registrierung</Typography>
            <form className={classes.form} onSubmit={this.onSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="firstname">Vorname</InputLabel>
                <Input
                  id="firstname"
                  name="firstname"
                  autoComplete="firstname"
                  autoFocus
                  value={firstname}
                  onChange={event =>
                    this.setState(byPropKey('firstname', event.target.value))
                  }
                  type="text"
                  placeholder="Vorname"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="lastname">Nachname</InputLabel>
                <Input
                  id="lastname"
                  name="lastname"
                  autoComplete="lastname"
                  value={lastname}
                  onChange={event =>
                    this.setState(byPropKey('lastname', event.target.value))
                  }
                  type="text"
                  placeholder="Nachname"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">E-Mail</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={event =>
                    this.setState(byPropKey('email', event.target.value))
                  }
                  type="text"
                  placeholder="E-Mail"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="passwordOne">Passwort</InputLabel>
                <Input
                  id="passwordOne"
                  name="passwordOne"
                  autoComplete="passwordOne"
                  value={passwordOne}
                  onChange={event =>
                    this.setState(byPropKey('passwordOne', event.target.value))
                  }
                  type="password"
                  placeholder="Passwort"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="passwordTwo">
                  Passwort bestätigen
                </InputLabel>
                <Input
                  id="passwordTwo"
                  name="passwordTwo"
                  autoComplete="passwordTwo"
                  value={passwordTwo}
                  onChange={event =>
                    this.setState(byPropKey('passwordTwo', event.target.value))
                  }
                  type="password"
                  placeholder="Passwort bestätigen"
                />
              </FormControl>

              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-end"
              >
                <Button
                  className={classes.cancel}
                  onClick={() => {
                    this.handleCancelSubmit();
                  }}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isInvalid}
                  type="submit"
                >
                  Registrieren
                </Button>
              </Grid>
            </form>
            <MessageBox
              open={!!this.state.message}
              message={this.state.message}
              onClose={this.deleteMessage}
            />
            {this.renderRedirect()}
          </Paper>
        </section>
      </main>
    );
  }
}

SignUpPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SignUpPage));
const SignUpForm = withStyles(styles)(SignUpFormWithoutStyles);
export { SignUpForm };
