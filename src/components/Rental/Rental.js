import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import RentalForm from './RentalForm';
import RentalList from './RentalList';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';



const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit *2,
        display: 'flex',
        flexDirection: 'column',
        // padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    header:{
        padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    }
});


class Rental extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rentals: null,
            showForm: false,
        };
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(){
        this.state.showForm ? this.setState({showForm: false}) : this.setState({showForm: true})
    }

    render() {
        const {classes} = this.props;


        return (
            <Paper className={classes.paper}>
                <div className={classes.header}>
                    <Grid
                        container
                        justify= "space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="headline">Wohnungen</Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="fab" color='primary' onClick={this.handleClick}>
                                <AddIcon />
                            </Button>
                        </Grid>
                    </Grid>
                { this.state.showForm ? <RentalForm handleClick={this.handleClick.bind(this)}/> : null }
                </div>
                <RentalList/>
            </Paper>

        );
    }
}

Rental.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Rental);