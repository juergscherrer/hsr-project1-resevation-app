import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CalendarIcon from '@material-ui/icons/CalendarToday';

const styles = theme => ({

});

class RentalListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleOpenDetailsClick = this.handleOpenDetailsClick.bind(this);
    }

    handleOpenDetailsClick(rentalId) {
        this.props.openDetails(rentalId);
    }


    render() {
        const {classes, rental, rentalId} = this.props;

        return (
            <ListItem button onClick={() => this.handleOpenDetailsClick(rentalId)}>
                <Avatar>
                    <HomeIcon color={rental.owner ? "primary" : "inherit"}/>
                </Avatar>
                <ListItemText primary={rental.title} secondary={rental.description}/>
                <ListItemSecondaryAction>
                    <IconButton>
                        <CalendarIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}


RentalListItem.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RentalListItem);