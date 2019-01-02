import React from 'react';
import RentalListItem from './RentalListItem';
import { auth } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { getUserRentalsWithUser } from '../../firebase/queries/userRentals';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
});

const INITIAL_STATE = {
  rentals: null,
  activeItem: null
};

class RentalList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.getUserRentals().catch(error => {
      this.props.setMessage(
        `Mietobjekte konnten nicht geladen werden. Fehlermeldung: ${error}`
      );
    });
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getUserRentals = async () => {
    const userRentalsRef = await getUserRentalsWithUser(auth.currentUser().uid);
    return userRentalsRef.onSnapshot(userRentals => {
      this.setState({ rentals: userRentals.docs });
    });
  };

  setActiveItem = key => {
    this.setState({ activeItem: key });
  };

  render() {
    const { classes } = this.props;
    const { rentals, activeItem } = this.state;

    let content = '';
    if (rentals) {
      content = (
        <div className={classes.root}>
          <List>
            {rentals.map((rental, index) => {
              let selected = false;
              if (activeItem === index) {
                selected = true;
              }
              return (
                <RentalListItem
                  openDetails={this.props.openDetails}
                  activeItem={this.setActiveItem}
                  rental={rental.data()}
                  index={index}
                  key={index}
                  selected={selected}
                />
              );
            })}
          </List>
        </div>
      );
    }

    return <div>{content}</div>;
  }
}

RentalList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RentalList);
