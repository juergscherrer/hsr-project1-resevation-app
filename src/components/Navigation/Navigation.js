import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AuthUserContext from '../UserAuthentication/AuthUserContext';
import NavigationDrawer from './NavigationDrawer';

const styles = theme => ({
  appBar: {
    position: 'relative'
  },

  grow: {
    flexGrow: 1
  }
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    const Navigation = () => (
      <AuthUserContext.Consumer>
        {authUser => (authUser ? <NavigationAuth /> : null)}
      </AuthUserContext.Consumer>
    );

    const NavigationAuth = () => (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar disableGutters={true}>
            <NavigationDrawer />
            <Typography
              variant="title"
              color="inherit"
              className={classes.grow}
            >
              Reservations - App
            </Typography>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );

    return Navigation();
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigation);
