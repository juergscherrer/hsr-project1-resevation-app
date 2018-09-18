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
        this.props.rental && this.setState({id: this.props.rental[0], title: this.props.rental[1].title, description: this.props.rental[1].description, priceForGuest: this.props.rental[1].priceForGuest, priceForOwner: this.props.rental[1].priceForOwner});
    }

    onSubmit = (event) => {
        const {
            title,
            description,
            priceForGuest,
            priceForOwner,
        } = this.state;

        db.doCreateRental(title, description, priceForGuest, priceForOwner)
            .then(newRental => {
                db.doCreateRentalUser(true, true, newRental.key, auth.currentUser().uid)
                    .then(() => {
                        this.props.handleClick();
                        this.setState({...INITIAL_STATE});
                    })
                    .catch(error => {
                        this.setState(byPropKey('error', error));
                    });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });


        event.preventDefault();
    };

    render() {
        const {classes, rental} = this.props;
        const {
            title,
            description,
            priceForGuest,
            priceForOwner,
            error,
        } = this.state;

        const isInvalid =
            title === '' ||
            description === '' ||
            priceForGuest === '' ||
            priceForOwner === '';

        return (


            <form className={classes.form} onSubmit={this.onSubmit}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="title">Title</InputLabel>
                    <Input id="title"
                           value={title}
                           onChange={event => this.setState(byPropKey('title', event.target.value))}
                           autoFocus/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input id="description"
                           value={description}
                           onChange={event => this.setState(byPropKey('description', event.target.value))}
                           />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="priceForGuest">Price for guest</InputLabel>
                    <Input id="priceForGuest"
                           type="number"
                           value={priceForGuest}
                           onChange={event => this.setState(byPropKey('priceForGuest', event.target.value))}/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="priceForOwner">Price for owner</InputLabel>
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
                    Save
                </Button>
            </form>


 /*               <form className={classes.form} onSubmit={this.onSubmit}>
                    <FormControl margin="normal" required fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <Input id="title" value={title}
                               onChange={event => this.setState(byPropKey('title', event.target.value))}/>
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <Input id="description" value={description}
                               onChange={event => this.setState(byPropKey('description', event.target.value))}/>
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="priceForGuest">Price for guest</InputLabel>
                        <Input id="priceForGuest" value={priceForGuest}
                               onChange={event => this.setState(byPropKey('priceForGuest', event.target.value))}/>
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="priceForOwner">Price for owner</InputLabel>
                        <Input id="priceForOwner" value={priceForOwner}
                               onChange={event => this.setState(byPropKey('priceForOwner', event.target.value))}/>
                    </FormControl>
                    <Button color="primary" disabled={isInvalid} type="submit" variant="contained"
                            className={classes.button}>
                        <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                        Save
                    </Button>
                </form>*/


        )
            ;
    }
}


export default withRouter(withStyles(styles)(RentalForm));


{/*
<input
    value={description}
    onChange={event => this.setState(byPropKey('description', event.target.value))}
    type="text"
    placeholder="Description"
/>
<input
value={priceForGuest}
onChange={event => this.setState(byPropKey('priceForGuest', event.target.value))}
type="number"
placeholder="Price for guest"
    />
    <input
value={priceForOwner}
onChange={event => this.setState(byPropKey('priceForOwner', event.target.value))}
type="number"
placeholder="Price for Owner"
    />
    <button disabled={isInvalid} type="submit">
    Save
    </button>

{ error && <p>{error.message}</p> }
*/
}

