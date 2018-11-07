import React, {Component} from 'react';
import {Link, withRouter,} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import RentalUsersListItem from './RentalUsersListItem'


import {auth, db} from '../../firebase/index';
import * as routes from '../../constants/routes';

const styles = theme => ({

    header:{
        padding: `0px ${theme.spacing.unit * 3}px`,
    },

    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },

    submit: {
        marginTop: theme.spacing.unit * 3,
    },

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    formControl: {
        margin: theme.spacing.unit,
    },

    button: {
        margin: theme.spacing.unit,
    },

    leftIcon: {
        marginRight: theme.spacing.unit,
    },

    iconSmall: {
        fontSize: 20,
    },
});


const INITIAL_STATE = {
    rentalId: '',
    title: '',
    description: '',
    users: [],
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class RentalUsersList extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};

    }


    componentDidMount() {
        if (this.props.rentalId){
            db.getRental(this.props.rentalId).on('value', rental =>{
                this.setState({
                    rentalId: rental.key,
                    title: rental.val().title,
                    description: rental.val().description,
                    users: rental.val().users,
                });
            })
        }
    }


    componentWillUnmount() {
        this.setState({...INITIAL_STATE});
    }


    render() {
        const {classes} = this.props;
        const {users, rentalId, title, description} = this.state;

        let list =
                <div>
                    <List>
                        {Object.keys(users).map(key =>
                            <RentalUsersListItem userId={key} rentalId={rentalId} key={key}/>
                        )}
                    </List>
                </div>

        return (
            <div>
                <div className={classes.header}><h3>Benuzter von {title} {description} vewalten</h3></div>
                {list}
                <hr />
            </div>


        )
            ;
    }
}


export default withRouter(withStyles(styles)(RentalUsersList));