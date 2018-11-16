import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.props.open}
          onClose={this.props.onClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.props.message || ''}</span>}
          autoHideDuration={6000}
        />
      </React.Fragment>
    );
  }
}

export default MessageBox;
