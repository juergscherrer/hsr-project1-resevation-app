import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {SignUpLink} from './SignUp';
import {PasswordForgetLink} from './PasswordForget';
import {auth} from '../../firebase/index';
import * as routes from '../../constants/routes';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import LockIcon from '@material-ui/icons/LockOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Background from '../../img/loginscreen-jaunpassstrasse.jpg';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
    passwordIsMasked: true,
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
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
    },
    eye: {
        cursor: 'pointer',
    },
});

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const {
            email,
            password,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({...INITIAL_STATE});
                history.push(routes.DASHBOARD);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    togglePasswordMask = () => {
        this.setState(prevState => ({
            passwordIsMasked: !prevState.passwordIsMasked,
        }));
    };

    render() {

        const {classes} = this.props;
        const {passwordIsMasked} = this.state;
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
            password === '' ||
            email === '';

        return (
            <main className={classes.background}>
                <section className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockIcon/>
                        </Avatar>
                        <Typography variant="headline">Sign in</Typography>
                        <form className={classes.form} onSubmit={this.onSubmit}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                                    type="text"
                                    placeholder="Email Address"

                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    name="password"
                                    type={passwordIsMasked ? 'password' : 'text'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={event => this.setState(byPropKey('password', event.target.value))}
                                    placeholder="Password"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Lock/>
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <RemoveRedEye
                                                className={classes.eye}
                                                onClick={this.togglePasswordMask}
                                            />
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                variant="raised"
                                color="primary"
                                className={classes.submit}
                                disabled={isInvalid}
                                type="submit"
                            >
                                Sign in
                            </Button>

                            <PasswordForgetLink/>
                            <SignUpLink/>

                            {error && <p>{error.message}</p>}

                        </form>
                    </Paper>
                </section>
            </main>
        );
    }
}

SignInForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SignInForm));
