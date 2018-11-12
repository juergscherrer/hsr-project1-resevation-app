import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {auth, db} from '../../firebase';


const styles = theme => ({});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});


class RentalListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,

        };

        this.handleOwnerChange = this.handleOwnerChange.bind(this);
        this.handleManagerChange = this.handleManagerChange.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate(prevProps) {
        if (this.props.userRental.data().userId !== prevProps.userRental.data().userId) {
            this.getUser();
        }
    }

    getUser() {
        db.collection("users").doc(this.props.userRental.data().userId)
            .onSnapshot(user => {
                this.setState({user: user.data()});
            });
    }

    handleOwnerChange(event) {
        let owner = event.target.checked;
        this.editOwnerUserRental(owner);
    }

    handleManagerChange(event) {
        let manager = event.target.checked;
        this.editManagerUserRental(manager);
    }

    // editOwnerUserRental = (owner) => {
    //     db.editUserRental(this.props.userId, this.state.userRentalId, this.state.title, this.state.description, owner, this.state.manager)
    //         .then(() => {
    //             // this.setState({owner: owner});
    //         })
    //         .catch(error => {
    //             this.setState(byPropKey('error', error));
    //         });
    //
    // };

    editOwnerUserRental = (owner) => {

        const userRental = db.collection("userRentals").doc(this.props.userRental.id);

        return userRental.update({
            owner
        })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                console.error("Error updating document: ", error);
            });

    };

    editManagerUserRental = (manager) => {

        const userRental = db.collection("userRentals").doc(this.props.userRental.id);

        return userRental.update({
            manager
        })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                console.error("Error updating document: ", error);
            });

    };

    render() {

        const {classes, userRental} = this.props;
        const {owner, manager} = userRental.data();

        return (
            <ListItem>
                <Avatar>
                    <PersonIcon/>
                </Avatar>
                <ListItemText primary={this.state.user && this.state.user.firstname + ' ' + this.state.user.lastname}
                              secondary={this.state.user && this.state.user.email}/>
                <ListItemSecondaryAction>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={owner === true}
                                    onChange={this.handleOwnerChange}
                                />
                            }
                            label="Besitzer"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={manager === true}
                                    onChange={this.handleManagerChange}
                                    value="checkedA"
                                />
                            }
                            label="Manager"
                        />
                    </FormGroup>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}


RentalListItem.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RentalListItem);