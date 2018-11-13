import React, { Component } from "react";

import withAuthorization from "./UserAuthentication/withAuthorization";
import { db } from "../firebase";

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null
    };
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState({ users: snapshot.val() })
    );
  }

  render() {
    const { users } = this.state;

    return (
      <div>
        <h1>Admin Dashboard</h1>
        {!!users && <UserList users={users} />}
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <div>
    <h2>Users</h2>

    {Object.keys(users).map(key => (
      <div key={key}>
        {users[key].firstname} {users[key].lastname} {users[key].email}
      </div>
    ))}
  </div>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AdminPage);
