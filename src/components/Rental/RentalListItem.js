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
import PeopleIcon from '@material-ui/icons/People';

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
        this.props.handleEditClick(this.props.rentalId);
    }

    handleDeleteClick(id) {
        db.editRental(id, this.props.rental.title, this.props.rental.description, this.props.rental.priceForGuest, this.props.rental.priceForOwner, true);
    }

    handleManageUsersClick() {
        this.props.handleManageUsersClick(this.props.rentalId);
    }


    render() {
        const {classes, rental, rentalId} = this.props;
        let iconContent = [];

        if(rental.manager || rental.owner){
            iconContent.push(
                <IconButton key={"edit"} aria-label="Edit" onClick={() => this.handleEditClick(rentalId)}>
                    <EditIcon/>
                </IconButton>)
        }

        if(rental.owner){
            iconContent.push(
            <IconButton key={"delete"} aria-label="Delete" onClick={() => this.handleDeleteClick(rentalId)}>
                <DeleteIcon/>
            </IconButton>)
            iconContent.push(
                <IconButton key={"manage_users"} aria-label="Manage Users" onClick={() => this.handleManageUsersClick(rentalId)}>
                    <PeopleIcon/>
                </IconButton>)
        }

        return (
            <ListItem button onClick={() => this.handleOpenClick(rentalId)}>
                <Avatar>
                    <HomeIcon color={rental.owner ? "primary" : "inherit"}/>
                </Avatar>
                <ListItemText primary={rental.title} secondary={rental.description}/>
                <ListItemSecondaryAction>
                    {iconContent}
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}


RentalListItem.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RentalListItem);