import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withAuthorization from '../UserAuthentication/withAuthorization';
import { getUsers } from '../../firebase/queries/users';
import MessageBox from '../MessageBox';
import UserList from './UserList';

import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  layout: {
    maxWidth: 1280,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: `${theme.spacing.unit * 6}px`
  }
});

const INITIAL_STATE = {
  message: null,
  users: null
};

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  componentDidMount() {
    getUsers()
      .then(users => {
        this.setState({ users: users });
      })
      .catch(error => {
        this.setMessage(
          `Fehler in der Benutzer Suche. Fehlermeldung: ${error}`
        );
        console.log(error);
      });
  }

  render() {
    const { users } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.layout}>
        <Paper className={classes.root}>
          <h1 className={classes.header}>Admin Dashboard</h1>
          {!!users && <UserList users={users} setMessage={this.setMessage} />}
          <MessageBox
            open={!!this.state.message}
            message={this.state.message}
            onClose={this.deleteMessage}
          />
        </Paper>
      </div>
    );
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(withStyles(styles)(AdminPage));
