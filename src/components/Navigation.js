import React from 'react';
import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import AuthUserContext from './AuthUserContext';
import SignOutButton from './SignOut';
import * as routes from '../constants/routes';
import {auth} from "../firebase";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    icon: {
        marginRight: theme.spacing.unit * 2,
    },
});


class Navigation extends React.Component {
    constructor(props) {
        super(props);

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
                    <Toolbar>
                        <Typography variant="title" color="inherit" noWrap>
                            Reservation App
                        </Typography>
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

    )
        ;
    }
}


export default withStyles(styles)(Navigation);


{/*
<ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.DASHBOARD}>Dashboard</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><Link to={routes.ADMIN}>Admin Dashboard</Link></li>
    <li><SignOutButton /></li>
</ul>*/
}
