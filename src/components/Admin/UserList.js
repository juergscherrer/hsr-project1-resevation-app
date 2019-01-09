import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withAuthorization from '../UserAuthentication/withAuthorization';

import { withStyles } from '@material-ui/core/styles/index';
import PersonIcon from '@material-ui/icons/Person';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  userList: {
    margin: `${theme.spacing.unit * 3}px`
  }
});

const INITIAL_STATE = {
  message: null,
  users: null
};

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
    this.setState({ users: this.props.users });
  }

  render() {
    const users = this.state.users;
    const { classes } = this.props;

    return (
      <div className={classes.userList}>
        <h2 className={classes.header}>Liste aller Benutzer</h2>

        <List className={classes.root}>
          {Object.keys(users).map(key => (
            <React.Fragment key={key}>
              <ListItem
                title={'Email an ' + users[key].email + ' senden.'}
                button
                alignitems="flex-start"
                onClick={() =>
                  (window.location.href = `mailto:${users[key].email}`)
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      {users[key].firstname} {users[key].lastname}
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {users[key].email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </div>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired
};

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(withStyles(styles)(UserList));
