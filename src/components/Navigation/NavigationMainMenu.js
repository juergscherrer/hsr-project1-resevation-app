import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

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



class NavigationMainMenu extends React.Component {
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
                    aria-label="More"
                    aria-owns={open ? 'menu-main' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-main"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleCloseLeft}><Link className={classes.menuLink} to={routes.DASHBOARD}>Dashboard</Link></MenuItem>
                    <MenuItem onClick={this.handleCloseLeft}><Link className={classes.menuLink} to={routes.ADMIN}>Admin Dashboard</Link></MenuItem>
                    <MenuItem onClick={this.handleCloseLeft}><Link className={classes.menuLink} to={routes.INVOICES}>Invoices</Link></MenuItem>
                </Menu>
            </React.Fragment>

        );
    }
}

NavigationMainMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(NavigationMainMenu);

