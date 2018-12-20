import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withAuthorization from './UserAuthentication/withAuthorization';
import Rental from './Rental/Rental';

const styles = theme => ({
  layout: {
    maxWidth: 1280,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
});

class Dashboard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.layout}>
        <Rental />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuthorization(authCondition)(withStyles(styles)(Dashboard));
