import React from 'react';
import RentalListItem from './RentalListItem';
import {db, auth} from '../../firebase';

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
    }


    componentDidMount() {
        this.getUserRentals();
    }

    getUserRentals() {
        db.collection("userRentals")
            .where("userId", "==", auth.currentUser().uid)
            .onSnapshot(userRentals => {
                this.setState({rentals: userRentals.docs});
            });
    }

    componentWillUnmount() {
        this.setState({rentals: null});
    }

    render() {
        const {classes} = this.props;
        const {rentals} = this.state;

        let content = '';
        if (rentals) {

            let list = ''

            content =
                <div className={classes.root}>
                    <List>
                        {rentals.map((rental, index) => {
                            return <RentalListItem openDetails={this.props.openDetails} rental={rental.data()}
                                                   key={index}/>;
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