import React from 'react';
import PropTypes from 'prop-types';

import RentalForm from './RentalForm';
import RentalList from './RentalList';
import RentalDetails from './RentalDetails';
import MessageBox from '../MessageBox';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },

  emptyMessage: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.54)'
  }
});

const INITIAL_STATE = {
  showRentalForm: false,
  showRentalDetails: false,
  rentalId: null,
  clearActiveItem: false,
  message: null
};

class Rental extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.openForm = this.openForm.bind(this);
    this.openDetails = this.openDetails.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  openForm() {
    this.state.showRentalForm
      ? this.setState({ showRentalForm: false, rentalId: null })
      : this.setState({
          showRentalForm: true,
          showRentalDetails: false,
          rentalId: null
        });
    this.setState({ clearActiveItem: true });
  }

  openDetails(rentalId) {
    this.setState({ showRentalDetails: true, rentalId: rentalId });
  }

  closeDetails() {
    this.setState({ showRentalDetails: false, rentalId: null });
  }

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  render() {
    const { classes } = this.props;
    const { showRentalDetails, rentalId } = this.state;

    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={24}
        >
          <Grid item xs={12} sm={4} display="flex">
            <Paper className={classes.paper}>
              <div className={classes.content}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="headline">Mietobjekte</Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="fab"
                      mini
                      color={
                        this.state.showRentalForm ? 'secondary' : 'primary'
                      }
                      onClick={this.openForm}
                    >
                      {this.state.showRentalForm ? <CloseIcon /> : <AddIcon />}
                    </Button>
                  </Grid>
                </Grid>
              </div>
              {this.state.showRentalForm ? (
                <div className={classes.content}>
                  <RentalForm
                    handleClick={this.openForm}
                    setMessage={this.setMessage}
                  />
                </div>
              ) : (
                <RentalList
                  openDetails={this.openDetails}
                  setMessage={this.setMessage}
                  clearActiveItem={this.state.clearActiveItem}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} display="flex">
            <Paper className={classes.paper}>
              <div className={classes.content}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="headline">Details</Typography>
                  </Grid>
                </Grid>
              </div>
              {showRentalDetails ? (
                <RentalDetails
                  rentalId={rentalId}
                  closeDetails={this.closeDetails}
                  setMessage={this.setMessage}
                />
              ) : (
                <div className={classes.emptyMessage}>
                  <span>
                    Bitte wähle ein Mietobjekt aus der Liste aus, oder erstelle
                    ein neues.
                  </span>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
        <MessageBox
          open={!!this.state.message}
          message={this.state.message}
          onClose={this.deleteMessage}
        />
      </React.Fragment>
    );
  }
}

Rental.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Rental);
