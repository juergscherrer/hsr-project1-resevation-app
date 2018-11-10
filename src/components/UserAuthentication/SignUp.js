import React, {Component} from 'react';
import {Link, withRouter, Redirect} from 'react-router-dom';
import {auth, db} from '../../firebase/index';
import * as routes from '../../constants/routes';
import Background from '../../img/loginscreen-jaunpassstrasse.jpg';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import AssignmentInd from '@material-ui/icons/AssignmentInd';


const SignUpPage = ({history}) =>
    <div>
        <SignUpForm history={history}/>
    </div>

const INITIAL_STATE = {
    firstname: '',
    lastname: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
    redirect: false
};

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit * 10,
        height: '100vh',
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    background: {
        backgroundImage: 'url(' + Background + ')',
        backgroundSize: 'cover',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 1,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.primary.main,
    },
});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpFormWithoutStyles extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const {
            firstname,
            lastname,
            email,
            passwordOne,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {

                // Add a new document with a generated id.
                db.collection("users").add({
                    admin: true,
                    email,
                    firstname,
                    lastname
                })
                    .then(user => {
                        console.log("Document written with ID: ", user.id);

                        this.setState({
                            redirect: true
                        })

                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });


            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
    }

    render() {
        const {classes} = this.props;
        const {
            firstname,
            lastname,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            firstname === '' ||
            lastname === '';

        return (
            <main className={classes.background}>
                <section className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <AssignmentInd/>
                        </Avatar>
                        <Typography variant="headline">Registrierung</Typography>
                        <form className={classes.form} onSubmit={this.onSubmit}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="firstname">Vorname</InputLabel>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    autoComplete="firstname"
                                    autoFocus
                                    value={firstname}
                                    onChange={event => this.setState(byPropKey('firstname', event.target.value))}
                                    type="text"
                                    placeholder="Vorname"
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="lastname">Nachname</InputLabel>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    autoComplete="lastname"
                                    value={lastname}
                                    onChange={event => this.setState(byPropKey('lastname', event.target.value))}
                                    type="text"
                                    placeholder="Nachname"
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">E-Mail</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                                    type="text"
                                    placeholder="E-Mail"
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="passwordOne">Passwort</InputLabel>
                                <Input
                                    id="passwordOne"
                                    name="passwordOne"
                                    autoComplete="passwordOne"
                                    value={passwordOne}
                                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                                    type="password"
                                    placeholder="Passwort"
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="passwordTwo">Passwort bestätigen</InputLabel>
                                <Input
                                    id="passwordTwo"
                                    name="passwordTwo"
                                    autoComplete="passwordTwo"
                                    value={passwordTwo}
                                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                                    type="password"
                                    placeholder="Passwort bestätigen"
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                variant="raised"
                                color="primary"
                                className={classes.submit}
                                disabled={isInvalid}
                                type="submit">
                                Jetzt registrieren
                            </Button>

                            {error && <p>{error.message}</p>}

                        </form>
                        {this.renderRedirect()}
                    </Paper>
                </section>
            </main>
        );
    }
}

const SignUpLink = () =>
    <p>
        Don't have an account?
        {' '}
        <Link to={routes.SIGN_UP}>Sign Up</Link>
    </p>

SignUpPage.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withRouter(withStyles(styles)(SignUpPage));

const SignUpForm = withStyles(styles)(SignUpFormWithoutStyles);


export {SignUpForm, SignUpLink};
