import React, {Component} from 'react';
import {Link, withRouter,} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';


import {auth, db} from '../../firebase/index';
import * as routes from '../../constants/routes';

const styles = theme => ({

    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },

    submit: {
        marginTop: theme.spacing.unit * 3,
    },

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    formControl: {
        margin: theme.spacing.unit,
    },

    button: {
        margin: theme.spacing.unit,
    },

    leftIcon: {
        marginRight: theme.spacing.unit,
    },

    iconSmall: {
        fontSize: 20,
    },
});


const INITIAL_STATE = {
    id: '',
    title: '',
    description: '',
    rental_users: [],
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class RentalUsersForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};

    }


    componentDidMount() {
        if (this.props.rentalId){
            db.getRental(this.props.rentalId).once('value').then((rental) =>{
                this.setState({
                    id: rental.key,
                    title: rental.val().title,
                    description: rental.val().description
                });
            })
        }
    }


    componentWillUnmount() {
        this.setState({...INITIAL_STATE});
    }

    onSubmit = (event) => {
        const {
            title,
            description,
            priceForGuest,
            priceForOwner,
        } = this.state;

        if(this.state.id){
            this.editRental(this.state.id, title, description, Number(priceForGuest), Number(priceForOwner));
        } else{
            this.newRental(title, description, Number(priceForGuest), Number(priceForOwner));
        }


        event.preventDefault();
    };

    newRental = (title, description, priceForGuest, priceForOwner) => {
        db.newRental(title, description, priceForGuest, priceForOwner)
            .then(newRental => {
                db.newUserRental(auth.currentUser().uid, newRental.key, true, true, title, description)
                    .then(() => {
                        this.setState({...INITIAL_STATE});
                        this.props.handleClick();
                    })
                    .catch(error => {
                        this.setState(byPropKey('error', error));
                    });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

    };

    editRental = (id, title, description, priceForGuest, priceForOwner) => {
        db.editRental(id, title, description, priceForGuest, priceForOwner)
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.props.handleClick();
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

    };

    render() {
        const {classes} = this.props;
        const {
            title,
            description,
            priceForGuest,
            priceForOwner,
        } = this.state;

        const isInvalid =
            title === '' ||
            description === '' ||
            priceForGuest === '' ||
            priceForOwner === '';

        return (


            <form className={classes.form} onSubmit={this.onSubmit}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="title">Benutzer Suchen</InputLabel>
                    <Input id="title"
                           value={title}
                           onChange={event => this.setState(byPropKey('title', event.target.value))}
                           autoFocus/>
                </FormControl>
                <Button
                    color="primary"
                    disabled={isInvalid}
                    type="submit"
                    fullWidth
                    variant="raised">
                    <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                    Save
                </Button>
            </form>
        )
            ;
    }
}


export default withRouter(withStyles(styles)(RentalUsersForm));