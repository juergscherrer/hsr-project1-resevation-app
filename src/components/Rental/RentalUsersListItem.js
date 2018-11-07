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


const styles = theme => ({

});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});


class RentalListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userRentalId: null,
            title: null,
            description: null,
            owner: null,
            manager: null,
            firstname: null,
            lastname: null,
            email: null,

        };

        this.handleOwnerChange = this.handleOwnerChange.bind(this);
        this.handleManagerChange = this.handleManagerChange.bind(this);
    }

    componentDidMount() {
        db.getUserRental(this.props.userId, this.props.rentalId).on('value', userRental => {
            console.log('user_rental', userRental.val());
            this.setState({
                userRentalId: userRental.key,
                title: userRental.val().title,
                description: userRental.val().description,
                owner: userRental.val().owner,
                manager: userRental.val().manager,
            });
        })

        db.getUser(this.props.userId).on('value', user => {
            console.log(user.val());
            this.setState({
                firstname: user.val().firstname,
                lastname: user.val().lastname,
                email: user.val().email,
            })
        })
    }

    handleOwnerChange(event) {
        let owner = event.target.checked;
        this.editOwnerUserRental(owner);
    }

    handleManagerChange(event) {
        let manager = event.target.checked;
        this.editManagerUserRental(manager);
    }

    editOwnerUserRental = (owner) => {
        db.editUserRental(this.props.userId, this.state.userRentalId, this.state.title, this.state.description, owner, this.state.manager)
            .then(() => {
                // this.setState({owner: owner});
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

    };

    editManagerUserRental = (manager) => {
        db.editUserRental(this.props.userId, this.state.userRentalId, this.state.title, this.state.description, this.state.owner, manager)
            .then(() => {
                // this.setState({owner: owner});
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

    };



    render() {
        const {userRentalId, owner, manager, firstname, lastname, email} = this.state;
        const {classes} = this.props;

        console.log('owner', owner);

        return (
            <ListItem>
                <Avatar>
                    <PersonIcon/>
                </Avatar>
                <ListItemText primary={firstname && firstname+' '+lastname} secondary={email && email}/>
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