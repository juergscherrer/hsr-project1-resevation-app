import React, {Component} from 'react';
import Dashboard from "./Dashboard";
import PasswordForgetPage from "./UserAuthentication/PasswordForget";
import SignInPage from "./UserAuthentication/SignIn";
import SignUpPage from "./UserAuthentication/SignUp";
import InvoicesPage from "./Invoices";
import * as routes from "../constants/routes";
import AccountPage from "./UserAuthentication/Account";
import AdminPage from "./Admin";
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import withAuthorization from "./UserAuthentication/withAuthorization";


const styles = theme => ({
    layout: {
        maxWidth: 1280,
        marginRight: "auto",
        marginLeft: "auto",
    },
});

class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {classes} = this.props;

        return(
            <div className={classes.layout}>
                <Route exact path={routes.DASHBOARD} component={Dashboard} />
                <Route exact path={routes.SIGN_UP} component={SignUpPage} />
                <Route exact path={routes.SIGN_IN} component={SignInPage} />
                <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route exact path={routes.ACCOUNT} component={AccountPage} />
                <Route exact path={routes.ADMIN} component={AdminPage} />
                <Route exact path={routes.INVOICES} component={InvoicesPage} />
            </div>
        )
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withStyles(styles)(Main));