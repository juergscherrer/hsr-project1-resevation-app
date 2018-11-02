import React, {Component} from 'react';
import Moment from 'react-moment';
import withAuthorization from './UserAuthentication/withAuthorization';
import {db} from '../firebase';


function InvoiceStatus(props) {
    const isPaid = props.isPaid;
    if (isPaid) {
        return <span>Yes</span>;
    }
    return  <span>No</span>;
}

class InvoicesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reservations: [],
        };
    }

    componentDidMount() {
        db.getReservations().on('value', reservations => {
            this.setState({reservations: reservations.val()});
        });
    }



    render() {

        const {reservations} = this.state;


        let output =
            <div>
                <ul>


                    {Object.keys(reservations).map((item, index) =>
                        <div key={index}>
                            <li>
                                Start Date:
                                <Moment format="YYYY-MM-DD HH:mm">
                                    {reservations[item].start_date}
                                </Moment>
                            </li>
                            <li>
                                End Date:
                                <Moment format="YYYY-MM-DD HH:mm">
                                    {reservations[item].end_date}
                                </Moment>
                            </li>
                            <li>Number of Persons: {reservations[item].number_of_persons}</li>

                            {Object.keys(reservations[item].invoices).map((subitem, index) =>
                                <div key={index}>
                                    <li>
                                        {reservations[item].invoices[subitem].comment}
                                    </li>
                                    <li>
                                        <InvoiceStatus isPaid={reservations[item].invoices[subitem].paid} />
                                    </li>
                                    <li>
                                        <Moment format="YYYY-MM-DD HH:mm">
                                            {reservations[item].invoices[subitem].paid_at}
                                        </Moment>
                                    </li>
                                    <li>
                                        <Moment format="YYYY-MM-DD HH:mm">
                                            {reservations[item].invoices[subitem].sent_at}
                                        </Moment>
                                    </li>
                                    <li>
                                        {reservations[item].invoices[subitem].total}
                                    </li>

                                </div>
                            )}


                        </div>
                    )}


                </ul>
            </div>

        return (
            <div>
                <h1>Invoices</h1>
                <div>
                    {output}
                </div>
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(InvoicesPage);

