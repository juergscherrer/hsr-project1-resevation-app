import React from 'react';
import AuthUserContext from './AuthUserContext';
import PropTypes from 'prop-types';
import PasswordChangeForm from './PasswordChange';
import PersonalInformtionForm from './PersonalInformation';
import withAuthorization from './withAuthorization';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import Typography from '@material-ui/core/Typography';
import MessageBox from '../MessageBox';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    display: 'flex',
    flexDirection: 'column'
  },
  layout: {
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
});

const INITIAL_STATE = {
  user: {},
  message: null,
  emailChanged: false
};

class AccountPage extends React.Component {
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

  render() {
    const { classes } = this.props;
    let admin = '';

    return (
      <div className={classes.layout}>
        <Grid
          className={classes.content}
          container
          direction="row"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={12} display="flex">
            <Paper className={classes.paper}>
              <AuthUserContext.Consumer>
                {authUser => (
                  <div>
                    <Typography variant="headline" gutterBottom={true}>
                      Mein Konto
                    </Typography>
                    <strong>{admin}</strong>

                    <Typography variant="title">Persönliche Daten</Typography>
                    <PersonalInformtionForm setMessage={this.setMessage} />

                    <Typography variant="title">Passwort ändern</Typography>
                    <PasswordChangeForm setMessage={this.setMessage} />

                    <MessageBox
                      open={!!this.state.message}
                      message={this.state.message}
                      onClose={this.deleteMessage}
                    />
                  </div>
                )}
              </AuthUserContext.Consumer>
            </Paper>
          </Grid>
        </Grid>
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
