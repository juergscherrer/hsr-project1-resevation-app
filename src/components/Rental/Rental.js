import React from "react";
import PropTypes from "prop-types";

import RentalForm from "./RentalForm";
import RentalList from "./RentalList";
import RentalDetails from "./RentalDetails";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  }
});

class Rental extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rentals: null,
      showRentalForm: false,
      showRentalDetails: false,
      rentalId: null
    };
    this.openForm = this.openForm.bind(this);
    this.openDetails = this.openDetails.bind(this);
  }

  openForm() {
    this.state.showRentalForm
      ? this.setState({ showRentalForm: false, rentalId: null })
      : this.setState({ showRentalForm: true });
  }

  openDetails(rentalId) {
    this.setState({ showRentalDetails: true, rentalId: rentalId });
  }

  render() {
    const { classes } = this.props;
    const { showRentalDetails, rentalId } = this.state;

    return (
      <React.Fragment>
        <Grid
          className={classes.content}
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={24}
        >
          <Grid item xs={12} sm={6} display="flex">
            <Paper className={classes.paper}>
              <div className={classes.header}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="headline">Mietobjekte</Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="fab"
                      color={
                        this.state.showRentalForm ? "secondary" : "primary"
                      }
                      onClick={this.openForm}
                    >
                      {this.state.showRentalForm ? <CloseIcon /> : <AddIcon />}
                    </Button>
                  </Grid>
                </Grid>
                {this.state.showRentalForm && (
                  <RentalForm handleClick={this.openForm} />
                )}
              </div>
              <RentalList openDetails={this.openDetails} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} display="flex">
            <Paper className={classes.paper}>
              <div className={classes.header}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="headline">Details</Typography>
                  </Grid>
                </Grid>
              </div>
              {showRentalDetails ? (
                <RentalDetails rentalId={rentalId} />
              ) : (
                <span className="emptyMessage">
                  Bitte Mietobjekt aus Liste wählen...
                </span>
              )}
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Rental.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Rental);
