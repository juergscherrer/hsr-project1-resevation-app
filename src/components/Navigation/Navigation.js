import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import AuthUserContext from '../UserAuthentication/AuthUserContext';

import NavigationMainMenu from './NavigationMainMenu';
import NavigationUserMenu from './NavigationUserMenu';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },

    grow: {
        flexGrow: 1,
    },
});



class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render() {
        const {classes} = this.props;

        const Navigation = () =>
            <AuthUserContext.Consumer>
                {authUser => authUser
                    ? <NavigationAuth/>
                    : <NavigationNonAuth/>
                }
            </AuthUserContext.Consumer>

        const NavigationAuth = () =>

            <React.Fragment>
                <CssBaseline/>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar disableGutters={true}>
                        <NavigationMainMenu />
                        <Typography variant="title" color="inherit" className={classes.grow}>
                            Reservation App
                        </Typography>
                        <NavigationUserMenu/>
                    </Toolbar>
                </AppBar>
            </React.Fragment>

        const NavigationNonAuth = () =>
            <React.Fragment>
                <CssBaseline/>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" noWrap>
                            Reservation App
                        </Typography>
                    </Toolbar>
                </AppBar>
            </React.Fragment>

        return (

            Navigation()

        );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Navigation);