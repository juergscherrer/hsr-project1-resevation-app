import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


import withAuthorization from './UserAuthentication/withAuthorization';
import {db} from '../firebase';

import Rental from './Rental/Rental';
import NewRental from './Rental/RentalForm';

const styles = theme => ({

    layout: {
        maxWidth: 1280,
        marginRight: "auto",
        marginLeft: "auto",
    },
});


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // users: null,

        };
    }


    render() {
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
                        xs={12} sm={6}
                        display="flex"
                    >
                        <Rental/>
                    </Grid>
                    <Grid
                        item
                        xs={12} sm={6}
                        display="flex"
                    >
                        <Rental/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


// const UserList = ({users}) =>
//     <div>
//         <h2>List of Usernames of Users</h2>
//         <p>(Saved on Sign Up in Firebase Database)</p>
//
//         {Object.keys(users).map(key =>
//             <div key={key}>{users[key].firstname} {users[key].lastname}</div>
//         )}
//     </div>

const authCondition = (authUser) => !!authUser;

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAuthorization(authCondition)(withStyles(styles)(Dashboard));