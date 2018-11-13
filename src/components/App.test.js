import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "./Navigation/Navigation";
import SignUpPage from "./UserAuthentication/SignUp";
import SignInPage from "./UserAuthentication/SignIn";
import PasswordForgetPage from "./UserAuthentication/PasswordForget";
import HomePage from "./Dashboard";
import AccountPage from "./UserAuthentication/Account";

import * as routes from "../constants/routes";

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={routes.SIGN_UP} component={SignUpPage} />
      <Route exact path={routes.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={routes.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={routes.HOME} component={HomePage} />
      <Route exact path={routes.ACCOUNT} component={AccountPage} />
    </div>
  </Router>
);

export default App;
