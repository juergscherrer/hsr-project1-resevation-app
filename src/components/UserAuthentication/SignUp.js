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
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';

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
    redirect: false,
    open: false,
    Transition: null,
    message: '',
    toLogin: false,
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
    cancel: {
        marginTop: theme.spacing.unit * 3,
        margin: theme.spacing.unit,
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

    handleCancelSubmit() {
        this.setState({
            toLogin: true
        })
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

                var doc = db.collection("users").doc(auth.currentUser().uid);
                doc.set({
                    admin: true,
                    email,
                    firstname,
                    lastname
                })
                    .then(user => {
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
                this.setState(byPropKey('message', error.message));
                this.setState(byPropKey('open', true));
            });

        event.preventDefault();
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
    }

    handleClose = () => {
        this.setState({open: false});
    };

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
        const {vertical, horizontal} = {vertical: 'bottom', horizontal: 'left'};

        if (this.state.toLogin === true) {
            return <Redirect to='/'/>
        }

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

                            <Grid container
                                  direction="row"
                                  justify="flex-end"
                                  alignItems="flex-end">
                                <Button className={classes.cancel} onClick={() => {
                                    console.log('onClick');
                                    this.handleCancelSubmit()
                                }}>Abbrechen</Button>
                                <Button
                                    variant="raised"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={isInvalid}
                                    type="submit">
                                    Registrieren
                                </Button>
                            </Grid>

                        </form>
                        <Snackbar
                            anchorOrigin={{vertical, horizontal}}
                            open={this.state.open}
                            onClose={this.handleClose}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={<span id="message-id">{this.state.message || ''}</span>}
                        />
                        {this.renderRedirect()}
                    </Paper>
                </section>
            </main>
        );
    }
}

const SignUpLink = () =>
    <Link to={routes.SIGN_UP}>Noch nicht registriert?</Link>

SignUpPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SignUpPage));
const SignUpForm = withStyles(styles)(SignUpFormWithoutStyles);
export {SignUpForm, SignUpLink};
