import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation/Navigation';
import CssBaseline from '@material-ui/core/CssBaseline';
import Main from './Main';
import withAuthentication from './UserAuthentication/withAuthentication';
import { withStyles } from '@material-ui/core/styles/index';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: orange
  },
  status: {
    danger: 'orange'
  }
});

const styles = theme => ({
  layout: {}
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div>
            <CssBaseline />
            <Navigation />
            <Main />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withAuthentication(withStyles(styles)(App));
