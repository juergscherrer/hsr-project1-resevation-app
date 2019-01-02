import React from 'react';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import { getRental } from '../../firebase/queries/rentals';

const INITIAL_STATE = {
  rental: null
};

class RentalListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.getRental().catch(error => {
      this.props.setMessage(
        `Rental konnte nicht geladen werden1. Fehlermeldung: ${error}`
      );
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rental.rentalId !== this.props.rental.rentalId) {
      this.getRental().catch(error => {
        this.props.setMessage(
          `Rental konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }

  getRental = async () => {
    const rentalRef = await getRental(this.props.rental.rentalId);
    return rentalRef.onSnapshot(rental => {
      this.setState({ rental: rental.data() });
    });
  };

  openDetails = () => {
    this.props.openDetails(this.props.rental.rentalId);
    this.props.activeItem(this.props.index);
  };

  render() {
    const { owner, rentalId } = this.props.rental;
    const { rental } = this.state;

    return (
      <ListItem
        button
        onClick={() => this.openDetails()}
        selected={this.props.selected}
      >
        <Avatar>
          <HomeIcon color={owner ? 'primary' : 'inherit'} />
        </Avatar>
        <ListItemText
          primary={rental && rental.title}
          secondary={rental && rental.description}
        />
        <ListItemSecondaryAction>
          <Link to={`/reservations/${rentalId}`}>
            <IconButton>
              <CalendarIcon />
            </IconButton>
          </Link>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default RentalListItem;
