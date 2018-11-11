import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import {withStyles} from "@material-ui/core/styles/index";
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import { db, auth } from '../../firebase';
import * as firebase from "firebase";

const styles = theme => ({
    submit: {
        marginBottom: theme.spacing.unit * 3,
    }

});

const INITIAL_STATE = {
    user: {},
};


class PersonalInformationForm extends Component {


    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // Updating the `users` local state attribute when the Firebase Realtime Database data
        // under the '/users' path changes.

        db.collection("users").doc(auth.currentUser().uid)
            .onSnapshot(doc => {
                this.setState({ user: doc.data()});
            });
    }

    componentWillUnmount() {

    }

    handleChange(event) {
        var user = {...this.state.user};
        user[event.target.name] = event.target.value;


        //this.firebaseRef.update(user);
        db.collection("users").doc(auth.currentUser().uid).set(user);



    };

    render() {
        const {classes} = this.props;

        const {
            firstname,
            lastname,
            email,
        } = this.state.user;

        const isInvalid =
            firstname === '' ||
            lastname === '' ||
            email === '';

        return (
            <div>
                <form className={classes.form}>
                    <TextField
                        id="firstname"
                        label="Firstname"
                        name="firstname"
                        className={classes.textField}
                        value={this.state.user.firstname || ''}
                        margin="normal"
                        onChange={this.handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        id="lastname"
                        label="Lastname"
                        name="lastname"
                        className={classes.textField}
                        value={this.state.user.lastname || ''}
                        margin="normal"
                        onChange={this.handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        id="email"
                        label="Email"
                        name="email"
                        className={classes.textField}
                        value={this.state.user.email || ''}
                        margin="normal"
                        onChange={this.handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                </form>
            </div>
        )
    }
}

PersonalInformationForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(PersonalInformationForm));
