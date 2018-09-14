import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import withAuthorization from './withAuthorization';
import { db } from '../firebase';

const styles = {

    layout: {
        maxWidth: 1280,
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: 50,
    },

    content: {
        justify: "center",
    },

    card: {

    }

};


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,

        };
    }

    componentDidMount() {
        db.onceGetUsers().then(snapshot =>
            this.setState({ users: snapshot.val() })
        );
    }

    handleChange = key => (event, value) => {
        this.setState({
            [key]: value,
        });
    };

    render() {
        const { users } = this.state;


        const { classes } = this.props;

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
                        <Card className={classes.card}>
                        <CardContent>
                            <Typography gutterBottom variant="headline" component="h2">
                                Wohnungen
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                        </CardActions>
                    </Card>
                    </Grid>
                    <Grid
                        item
                        display="flex"
                    >
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    Rechnungen
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}



const UserList = ({ users }) =>
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