import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';

import SignOutButton from '../UserAuthentication/SignOut';
import * as routes from '../../constants/routes';


const styles = theme => ({

    iconbutton: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    menuLink:{
        textDecoration: "none",
        color: "inherit",
    },
});



class NavigationUserMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };

    }
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };



    render() {
        const {classes} = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (

            <React.Fragment>
                <CssBaseline/>
                <IconButton
                    className={classes.iconbutton}
                    aria-owns={open ? 'menu-right' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-right"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleCloseRight}><Link className={classes.menuLink} to={routes.ACCOUNT}>My account</Link></MenuItem>
                    <MenuItem onClick={this.handleCloseRight}><SignOutButton/></MenuItem>

                </Menu>
            </React.Fragment>

        );
    }
}

NavigationUserMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(NavigationUserMenu);

