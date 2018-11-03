import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation/Navigation';
import CssBaseline from '@material-ui/core/CssBaseline';
import Main from './Main';
import withAuthentication from './UserAuthentication/withAuthentication';

const App = () =>
    <Router>
        <div>
            <CssBaseline/>
            <Navigation />
            <Main/>
        </div>
    </Router>

export default withAuthentication(App);
