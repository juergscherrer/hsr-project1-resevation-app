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
    priceForGuest: '',
    priceForOwner: '',
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class RentalForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};

    }


    componentDidMount() {
        if (this.props.rentalId){
            db.getRental(this.props.rentalId).once('value').then((snap) =>{
                console.log('getRental', snap.val());
                this.setState({
                    id: snap.key,
                    title: snap.val().title,
                    description: snap.val().description,
                    priceForGuest: snap.val().priceForGuest,
                    priceForOwner: snap.val().priceForOwner,
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
        db.collection("rentals").add({
            title,
            description,
            priceForGuest,
            priceForOwner
        })
            .then(rental => {
                db.collection("userRentals").add({
                    userId: auth.currentUser().uid,
                    rentalId: rental.id,
                    owner: true,
                    manager: true
                })
                    .then(userRental => {
                        this.setState({...INITIAL_STATE});
                        this.props.handleClick();
                    })
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
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
            <React.Fragment>
            <div className={classes.header}><h3>{this.state.id ? this.state.title+' bearbeiten' : 'Neues Mietobjekt erstellen'}</h3></div>
            <form className={classes.form} onSubmit={this.onSubmit}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="title">Titel</InputLabel>
                    <Input id="title"
                           value={title}
                           onChange={event => this.setState(byPropKey('title', event.target.value))}
                           autoFocus/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="description">Beschreibung</InputLabel>
                    <Input id="description"
                           value={description}
                           onChange={event => this.setState(byPropKey('description', event.target.value))}
                           />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="priceForGuest">Preis für Gast (pro Nacht)</InputLabel>
                    <Input id="priceForGuest"
                           type="number"
                           value={priceForGuest}
                           onChange={event => this.setState(byPropKey('priceForGuest', event.target.value))}/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="priceForOwner">Preis für Besitzer (pro Nacht)</InputLabel>
                    <Input id="priceForOwner"
                           type="number"
                           value={priceForOwner}
                           onChange={event => this.setState(byPropKey('priceForOwner', event.target.value))}/>
                </FormControl>
                <Button
                    color="primary"
                    disabled={isInvalid}
                    type="submit"
                    fullWidth
                    variant="raised">
                    <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                    Speichern
                </Button>
            </form>
        </React.Fragment>
        );
    }
}


export default withRouter(withStyles(styles)(RentalForm));