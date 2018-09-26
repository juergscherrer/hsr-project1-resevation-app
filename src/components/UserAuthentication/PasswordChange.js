import React, {Component} from 'react';
import {auth} from '../../firebase/index';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import {withRouter} from "react-router-dom";
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const styles = theme => ({
    submit: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
    },
});

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const {passwordOne} = this.state;

        auth.doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({...INITIAL_STATE});
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '';

        const {classes} = this.props;

        return (
            <form onSubmit={this.onSubmit}>
                <FormControl margin="normal" fullWidth>
                    <Input
                        value={passwordOne}
                        onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                        type="password"
                        placeholder="New Password"
                        fullWidth
                    />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <Input
                        value={passwordTwo}
                        onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                        type="password"
                        placeholder="Confirm New Password"
                        fullWidth
                    />
                </FormControl>
                <Button
                    disabled={isInvalid}
                    type="submit"
                    variant="raised"
                    color="primary"
                    className={classes.submit}
                    disabled={isInvalid}
                >
                    Reset My Password
                </Button>


                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

PasswordChangeForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withRouter(withStyles(styles)(PasswordChangeForm));