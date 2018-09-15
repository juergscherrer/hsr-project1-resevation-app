import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
    appBar: {
        position: 'relative',
    },

    grow: {
        flexGrow: 1,
    },
});


class Rental extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rentals: null,
        };

    }

    render() {
        const {classes} = this.props;


        return (
            <span>{this.state.rentals}</span>

        );
    }
}

Rental.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Rental);