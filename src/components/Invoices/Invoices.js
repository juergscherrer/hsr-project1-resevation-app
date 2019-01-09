import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withAuthorization from '../UserAuthentication/withAuthorization';
import MessageBox from '../MessageBox';
import InvoicesList from './InvoicesList';
import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto'
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  layout: {
    maxWidth: 1280,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: `${theme.spacing.unit}px`
  }
});

const INITIAL_STATE = {
  message: null,
  isPaid: false
};

class Invoices extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  setMessage = msg => {
    this.setState({ message: msg });
  };

  deleteMessage = () => {
    this.setState({ message: null });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.layout}>
        <Paper className={classes.root}>
          <h1 className={classes.header}>Rechnungen</h1>
          <InvoicesList setMessage={this.setMessage} />

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

const authCondition = authUser => !!authUser;

Invoices.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuthorization(authCondition)(withStyles(styles)(Invoices));
