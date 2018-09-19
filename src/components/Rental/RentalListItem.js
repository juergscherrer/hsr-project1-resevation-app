import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import {db} from '../../firebase';


const styles = theme => ({

});


class RentalListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    handleOpenClick(id) {
        console.log(id);
    }

    handleEditClick() {
        const rental = [this.props.rentalId, this.props.rental];
        this.props.handleEditClick(rental);
    }

    handleDeleteClick(id) {
        db.editRental(id, this.props.rental.title, this.props.rental.description, this.props.rental.priceForGuest, this.props.rental.priceForOwner, true);
    }


    render() {
        const {classes, rental, rentalId} = this.props;

        return (
            <ListItem button onClick={() => this.handleOpenClick(rentalId)}>
                <Avatar>
                    <HomeIcon color="primary"/>
                </Avatar>
                <ListItemText primary={rental.title} secondary={rental.description}/>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Edit" onClick={() => this.handleEditClick(rentalId)}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => this.handleDeleteClick(rentalId)}>
                        <DeleteIcon/>
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