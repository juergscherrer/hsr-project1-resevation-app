import React, {Component} from 'react';
import {auth} from '../../firebase';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';
import {Redirect} from 'react-router-dom';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    error: null,
    open: false,
    Transition: null,
    message: '',
    toLogin: false,
};

const styles = theme => ({
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    cancel: {
        marginTop: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit,
    },
});

class PasswordForgetForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    handleCancelSubmit(){
        this.setState({
            toLogin: true
        })
    }

    onSubmit = (event) => {
        const {email} = this.state;

        auth.doPasswordReset(email)
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.setState(byPropKey('message', 'Bitte prüfen Sie Ihren Posteingang.'));
                this.setState(byPropKey('open', true))
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
                this.setState(byPropKey('message', error.message));
                this.setState(byPropKey('open', true))
            });

        event.preventDefault();
    }

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const {
            email,
            error,
        } = this.state;

        const isInvalid = email === '';
        const {classes} = this.props;

        const {vertical, horizontal, open} = {vertical: 'bottom', horizontal: 'left',};

        if (this.state.toLogin === true) {
            return <Redirect to='/' />
        }

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">E-Mail</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            type="text"
                            placeholder="E-Mail"
                            value={this.state.email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            type="text"
                            placeholder="Email Address"
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
                            Reset My Password
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
            </div>
        );
    }
}

PasswordForgetForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PasswordForgetForm);
