import React from 'react';
import { db } from '../../firebase';
import { auth } from '../../firebase/index';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import RentalUsersList from "./RentalUsersList";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import RentalForm from "./RentalForm";


const styles = theme => ({
    topButtons:{
        paddingLeft: `${theme.spacing.unit * 3}px`,
        paddingRight: `${theme.spacing.unit * 3}px`,
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});


class RentalDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showRentalUsersList: true,
            rentalId: props.rentalId,
            showRentalForm: false,

        };


    }

    componentDidUpdate(prevProps){
        if(prevProps.rentalId !== this.props.rentalId){
            this.setState({
                rentalId: this.props.rentalId
            });
        }
    }


    render() {
        const {classes} = this.props;
        const {rentalId} = this.state;


        return <div>
            <div className={classes.topButtons}>
                <Button variant="outlined" size="small" className={classes.button}>
                    <CalendarIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Kalender
                </Button>
                <Button variant="outlined" size="small" className={classes.button}>
                    <EditIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Bearbeiten
                </Button>
                <Button variant="outlined" size="small" className={classes.button}>
                    <DeleteIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Löschen
                </Button>
                { this.state.showRentalForm && <RentalForm handleClick={this.openForm} rentalId={rentalId}/>}
            </div>
            {/*<h3>Reservationen</h3>*/}
            {/*<h3>Rechnungen</h3>*/}
            {this.state.showRentalUsersList && <RentalUsersList rentalId={rentalId}/>}
        </div>;
    }
}

export default withStyles(styles)(RentalDetails);