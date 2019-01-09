import React from 'react';
import PropTypes from 'prop-types';

import MessageBox from '../MessageBox';
import AlertDialog from '../AlertDialog';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { getUser } from '../../firebase/queries/users';
import {
  deleteUserRentalWithId,
  updateUserRental
} from '../../firebase/queries/userRentals';

const styles = theme => ({});

const INITIAL_STATE = {
  user: null,
  openAlertDialog: false,
  alertDialogtext: null,
  nestedOpen: false
};

class RentalListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.unsubscribeUser = null;
  }

  componentDidMount() {
    this.getUser().catch(error => {
      this.props.setMessage(
        `Benutzer konnte nicht geladen werden. Fehlermeldung: ${error}`
      );
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userRental.data().userId !== prevProps.userRental.data().userId
    ) {
      this.unsubscriber();
      this.getUser().catch(error => {
        this.props.setMessage(
          `Benutzer konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.unsubscriber();
    this.setState({ ...INITIAL_STATE });
  }

  unsubscriber = () => {
    this.unsubscribeUser && this.unsubscribeUser();
  };

  getUser = async () => {
    const userRef = await getUser(this.props.userRental.data().userId);
    const userSnap = userRef.onSnapshot(user => {
      this.setState({ user: user.data() });
    });
    this.unsubscribeUser = userSnap;
    return userSnap;
  };

  handleOwnerChange = event => {
    let owner = event.target.checked;
    this.editOwnerUserRental(owner);
  };

  handleManagerChange = event => {
    let manager = event.target.checked;
    this.editManagerUserRental(manager);
  };

  handleDelete = () => {
    const text = `${this.state.user.firstname} ${
      this.state.user.lastname
    } wirklich entfernen?`;
    this.setState({ openAlertDialog: true, alertDialogtext: text });
  };

  handleAnswer = answer => {
    if (answer) {
      this.deleteUserRental();
    } else {
      this.setState({ openAlertDialog: false, alertDialogtext: null });
    }
  };

  handleClick = () => {
    this.setState(state => ({ nestedOpen: !state.nestedOpen }));
  };

  deleteUserRental = () => {
    deleteUserRentalWithId(this.props.userRental.id)
      .then(() => {
        this.props.setMessage('Benuzter erfolgreich gelöscht');
      })
      .catch(error => {
        this.props.setMessage(
          `Benuzter konnte nicht gelöscht werden. Fehlermeldung: ${error}`
        );
      });
  };

  editOwnerUserRental = owner => {
    const userRentalRef = updateUserRental(this.props.userRental.id, { owner });
    return userRentalRef
      .then(() => {
        this.props.setMessage('Benuzter erfolgreich aktualisiert');
      })
      .catch(error => {
        this.props.setMessage(error);
      });
  };

  editManagerUserRental = manager => {
    const userRentalRef = updateUserRental(this.props.userRental.id, {
      manager
    });
    return userRentalRef
      .then(() => {
        this.props.setMessage('Benuzter erfolgreich aktualisiert');
      })
      .catch(error => {
        this.props.setMessage(error);
      });
  };

  render() {
    const { classes, userRental } = this.props;
    const { owner, manager } = userRental.data();

    return (
      <React.Fragment>
        <ListItem button onClick={this.props.userIsManager && this.handleClick}>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <ListItemText
            primary={
              this.state.user &&
              this.state.user.firstname + ' ' + this.state.user.lastname
            }
            secondary={this.state.user && this.state.user.email}
          />

          {this.props.userIsManager &&
            (this.state.nestedOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        <Collapse in={this.state.nestedOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              {this.props.userIsManager && (
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={owner === true}
                        onChange={this.handleOwnerChange}
                      />
                    }
                    label="Besitzer"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={manager === true}
                        onChange={this.handleManagerChange}
                        value="checkedA"
                      />
                    }
                    label="Manager"
                  />

                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    onClick={this.handleDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </FormGroup>
              )}
            </ListItem>
          </List>
        </Collapse>

        <MessageBox
          open={this.state.openMessageBox}
          message={this.state.message}
        />
        <AlertDialog
          open={this.state.openAlertDialog}
          text={this.state.alertDialogtext}
          handleAnswer={this.handleAnswer}
        />
      </React.Fragment>
    );
  }
}

RentalListItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RentalListItem);
