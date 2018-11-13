import React from "react";
import AuthUserContext from "./AuthUserContext";
import PropTypes from "prop-types";
import PasswordChangeForm from "./PasswordChange";
import PersonalInformtionForm from "./PersonalInformation";
import withAuthorization from "./withAuthorization";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 2,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  layout: {
    maxWidth: 1280,
    marginRight: "auto",
    marginLeft: "auto"
  }
});

class AccountPage extends React.Component {
  render() {
    const { classes } = this.props;
    let admin = "";

    return (
      <div className={classes.layout}>
        <div className={classes.header}>
          <Grid
            className={classes.content}
            container
            direction="row"
            alignItems="flex-start"
            spacing={24}
          >
            <Grid item xs={12} sm={6} display="flex">
              <Paper className={classes.paper}>
                <AuthUserContext.Consumer>
                  {authUser => (
                    <div>
                      <Typography variant="headline">My Account</Typography>
                      <strong>{admin}</strong>

                      <Typography variant="title">
                        Personal Information
                      </Typography>
                      <PersonalInformtionForm />

                      <Typography variant="title">Change Password</Typography>
                      <PasswordChangeForm />
                    </div>
                  )}
                </AuthUserContext.Consumer>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(
  withStyles(styles)(AccountPage)
);
