import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';


import withAuthorization from './UserAuthentication/withAuthorization';
import {db} from '../firebase';

import Rental from './Rental/Rental';
import NewRental from './Rental/NewRental';

const styles = theme => ({

    layout: {
        maxWidth: 1280,
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: 50,
    },


    paper: {
        maxWidth: 500,
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },

});


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,

        };
    }

    componentDidMount() {
        db.onceGetUsers().then(snapshot =>
            this.setState({users: snapshot.val()})
        );
    }

    handleChange = key => (event, value) => {
        this.setState({
            [key]: value,
        });
    };

    render() {
        const {users} = this.state;


        const {classes} = this.props;

        return (
            <div className={classes.layout}>
                <Grid
                    className={classes.content}
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                    spacing={24}
                >
                    <Grid
                        item
                        display="flex"
                    >
                        <Paper className={classes.paper}>
                            <Grid
                                container
                                justify= "space-between"
                                alignItems="center"
                            >
                                <Grid item><Typography variant="headline">Wohnungen</Typography></Grid>
                                <Grid item><Button variant="fab"
                                                   color='primary'
                                                   className={classes.fab}
                                >
                                    <AddIcon />
                                </Button></Grid>
                            </Grid>
                            <NewRental/>
                        </Paper>
                    </Grid>
                    <Grid
                        item
                        display="flex"
                    >
                        <Paper className={classes.paper}>

                            <Typography gutterBottom variant="headline" component="h2">
                                Rechnungen
                            </Typography>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


const UserList = ({users}) =>
    <div>
        <h2>List of Usernames of Users</h2>
        <p>(Saved on Sign Up in Firebase Database)</p>

        {Object.keys(users).map(key =>
            <div key={key}>{users[key].firstname} {users[key].lastname}</div>
        )}
    </div>

const authCondition = (authUser) => !!authUser;

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAuthorization(authCondition)(withStyles(styles)(Dashboard));