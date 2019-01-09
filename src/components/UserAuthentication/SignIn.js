import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Background from '../../img/loginscreen-jaunpassstrasse.jpg';
import { withRouter } from 'react-router-dom';
import { auth } from '../../firebase/index';
import * as routes from '../../constants/routes';
import MessageBox from '../MessageBox';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import LockIcon from '@material-ui/icons/LockOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  passwordIsMasked: true,
  message: null
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
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  eye: {
    cursor: 'pointer'
  },
  link: {
    marginRight: theme.spacing.unit * 3,
    textDecoration: 'none',
    color: theme.palette.primary.main
  }
});

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  onSubmit = event => {
    const { email, password } = this.state;
    const { history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(routes.DASHBOARD);
      })
      .catch(error => {
        this.setState({ error: error });
        this.setState({ message: error.message });
      });

    event.preventDefault();
  };

  togglePasswordMask = () => {
    this.setState(prevState => ({
      passwordIsMasked: !prevState.passwordIsMasked
    }));
  };

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  render() {
    const { classes } = this.props;
    const { passwordIsMasked } = this.state;
    const { email, password } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <main className={classes.background}>
        <section className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="headline">Login</Typography>
            <form className={classes.form} onSubmit={this.onSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">E-Mail</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                  type="text"
                  placeholder="E-Mail"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Passwort</InputLabel>
                <Input
                  name="password"
                  type={passwordIsMasked ? 'password' : 'text'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={event =>
                    this.setState({ password: event.target.value })
                  }
                  placeholder="Passwort"
                  startAdornment={
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <RemoveRedEye
                        className={classes.eye}
                        onClick={this.togglePasswordMask}
                      />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
                disabled={isInvalid}
                type="submit"
              >
                Login
              </Button>

              <Link className={classes.link} to={routes.PASSWORD_FORGET}>
                Passwort vergessen?
              </Link>
              <Link className={classes.link} to={routes.SIGN_UP}>
                Registrieren
              </Link>
            </form>
            <MessageBox
              open={!!this.state.message}
              message={this.state.message}
              onClose={this.deleteMessage}
            />
          </Paper>
        </section>
      </main>
    );
  }
}

SignInForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SignInForm));
