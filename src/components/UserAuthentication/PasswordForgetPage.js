import React, {Component} from 'react';
import PasswordForgetForm from './PasswordForget';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import Background from '../../img/loginscreen-jaunpassstrasse.jpg';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit * 10,
        height: '100vh',
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    background: {
        backgroundImage: 'url(' + Background + ')',
        backgroundSize: 'cover',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
});

class PasswordForgetPage extends Component {

    render() {

        const {classes} = this.props;

        return (
            <main className={classes.background}>
                <section className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockIcon/>
                        </Avatar>
                        <Typography variant="headline">Passwort vergessen</Typography>
                        <div>
                            <PasswordForgetForm/>
                        </div>
                    </Paper>
                </section>
            </main>
        );
    }
}

PasswordForgetPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PasswordForgetPage);
