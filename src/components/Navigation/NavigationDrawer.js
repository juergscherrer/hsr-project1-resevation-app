import React from 'react';
import PropTypes from 'prop-types';
import * as routes from '../../constants/routes';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/index';
import { getUserOnce } from '../../firebase/queries/users';

import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SecurityIcon from '@material-ui/icons/Security';
import MoneyIcon from '@material-ui/icons/Money';
import AccountIcon from '@material-ui/icons/AccountCircle';
import ExitIcon from '@material-ui/icons/ExitToApp';

const INITIAL_STATE = {
  top: false,
  left: false,
  bottom: false,
  right: false,
  admin: null
};

const styles = theme => ({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  iconButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  menuLink: {
    textDecoration: 'none',
    color: 'inherit'
  }
});

class NavigationDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.getUser();
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getUser = () => {
    if (auth.currentUser()) {
      getUserOnce(auth.currentUser().uid)
        .then(user => {
          if (user.exists) {
            this.setState({ admin: user.data().admin });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.setState({ admin: false });
    }
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  render() {
    const { classes } = this.props;
    const isAdmin = this.state.admin;
    let adminDashboardLink;

    if (isAdmin === true) {
      adminDashboardLink = (
        <Link className={classes.menuLink} to={routes.ADMIN}>
          <ListItem button>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText primary={'Admin Dashboard'} />
          </ListItem>
        </Link>
      );
    }

    const sideList = (
      <div className={classes.list}>
        <List>
          <Link className={classes.menuLink} to={routes.DASHBOARD}>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={'Dashboard'} />
            </ListItem>
          </Link>

          {adminDashboardLink}

          <Link className={classes.menuLink} to={routes.INVOICES}>
            <ListItem button>
              <ListItemIcon>
                <MoneyIcon />
              </ListItemIcon>
              <ListItemText primary={'Rechnungen'} />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link className={classes.menuLink} to={routes.ACCOUNT}>
            <ListItem button>
              <ListItemIcon>
                <AccountIcon />
              </ListItemIcon>
              <ListItemText primary={'Mein Konto'} />
            </ListItem>
          </Link>

          <ListItem button onClick={auth.doSignOut}>
            <ListItemIcon>
              <ExitIcon />
            </ListItemIcon>
            <ListItemText primary={'Abmelden'} />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div>
        <IconButton
          className={classes.iconButton}
          aria-label="Menu"
          onClick={this.toggleDrawer('left', true)}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

NavigationDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigationDrawer);
