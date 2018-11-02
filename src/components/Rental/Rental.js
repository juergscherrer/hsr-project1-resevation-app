import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import RentalForm from './RentalForm';
import RentalList from './RentalList';
import RentalUsersForm from './RentalUsersForm';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';



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
            showRentalForm: false,
            showRentalUsersForm: false,
            rentalId: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.editRental = this.editRental.bind(this);
    }

    handleClick(){
        this.state.showRentalForm ? this.setState({showRentalForm: false, rentalId: null}) : this.setState({showRentalForm: true})
    }

    editRental(rentalId){
        this.setState({showRentalForm: true, rentalId: rentalId})
    }

    handleManageUsers(rentalId){
        this.setState({showRentalUsersForm: true, rentalId: rentalId})
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
                            <Button variant="fab" color={this.state.showRentalForm ? 'secondary' : 'primary'} onClick={this.handleClick}>
                                {this.state.showRentalForm ? <CloseIcon /> : <AddIcon />}
                            </Button>
                        </Grid>
                    </Grid>
                { this.state.showRentalForm && <RentalForm rentalId={this.state.rentalId} handleClick={this.handleClick.bind(this)}/>}
                { this.state.showRentalUsersForm && <RentalUsersForm rentalId={this.state.rentalId} handleClick={this.handleClick.bind(this)}/>}
                </div>
                <RentalList editRental={this.editRental} handleManageUsers={this.handleManageUsers.bind(this)}/>
            </Paper>

        );
    }
}

Rental.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Rental);