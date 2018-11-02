import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import Navigation from './Navigation/Navigation';
import SignUpPage from './UserAuthentication/SignUp';
import SignInPage from './UserAuthentication/SignIn';
import PasswordForgetPage from './UserAuthentication/PasswordForget';
import Dashboard from './Dashboard';
import AccountPage from './UserAuthentication/Account';
import AdminPage from './Admin';
import InvoicesPage from './Invoices';
import CssBaseline from '@material-ui/core/CssBaseline';

import * as routes from '../constants/routes';

import withAuthentication from './UserAuthentication/withAuthentication';

const App = () =>
    <Router>
        <div>
            <CssBaseline/>
            <Navigation />
            <Route exact path={routes.DASHBOARD} component={Dashboard} />
            <Route exact path={routes.SIGN_UP} component={SignUpPage} />
            <Route exact path={routes.SIGN_IN} component={SignInPage} />
            <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route exact path={routes.ACCOUNT} component={AccountPage} />
            <Route exact path={routes.ADMIN} component={AdminPage} />
            <Route exact path={routes.INVOICES} component={InvoicesPage} />
        </div>
    </Router>


export default withAuthentication(App);