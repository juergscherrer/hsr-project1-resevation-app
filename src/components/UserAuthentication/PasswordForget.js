import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { auth } from '../../firebase';
import MessageBox from '../MessageBox';

import withStyles from '@material-ui/core/styles/withStyles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

const INITIAL_STATE = {
  email: '',
  error: null,
  open: false,
  Transition: null,
  message: '',
  toLogin: false
};

const styles = theme => ({
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  cancel: {
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit
  }
});

class PasswordForgetForm extends Component {
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
    const { email } = this.state;

    auth
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.setState({ message: 'Bitte prüfen Sie Ihren Posteingang' });
        this.setState({ open: true });
      })
      .catch(error => {
        this.setState({ error: error });
        this.setState({ message: error.message });
        this.setState({ open: true });
      });

    event.preventDefault();
  };

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  render() {
    const { email } = this.state;

    const isInvalid = email === '';
    const { classes } = this.props;

    if (this.state.toLogin === true) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">E-Mail</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              type="text"
              placeholder="E-Mail"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
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
              variant="raised"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
              type="submit"
            >
              zurücksetzen
            </Button>
          </Grid>
        </form>

        <MessageBox
          open={!!this.state.message}
          message={this.state.message}
          onClose={this.deleteMessage}
        />
      </div>
    );
  }
}

PasswordForgetForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PasswordForgetForm);
