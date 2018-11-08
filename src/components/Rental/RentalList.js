import React from 'react';
import RentalListItem from './RentalListItem';
import { db, auth } from '../../firebase';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});


class RentalList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rentals: [],

        };

        this.openDetails = this.openDetails.bind(this);
    }


    componentDidMount() {
        this.getRentals();
    }

    getRentals() {
        db.collection("user_rentals")
            .onSnapshot(userRentals => {
                this.setState({ rentals: userRentals.docs});
            });
    }

    componentWillUnmount() {
        this.setState({rentals: null});
    }

    openDetails(rentalId){
        this.props.openDetails(rentalId);
    }

    render() {
        const {classes} = this.props;
        const {rentals} = this.state;

        let content = '';
        if(rentals){

            let list = ''

            content =
                <div className={classes.root}>
                    <List>
                        {rentals.map((rental, index) => {
                            return <RentalListItem openDetails={this.openDetails} rental={rental.data()} key={index} rentalId={rental.id}/>;
                        })}
                    </List>
                </div>
        }

        return (
            <div>{content}</div>

        );
    }
}


RentalList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RentalList);