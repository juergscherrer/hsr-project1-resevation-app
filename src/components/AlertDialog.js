import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      this.setState({ open: this.props.open });
    }
  }

  handleFalse = () => {
    this.setState({ open: false });
    this.props.handleAnswer(false);
  };

  handleTrue = () => {
    this.setState({ open: false });
    this.props.handleAnswer(true);
  };

  render() {
    const { text } = this.props;
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleFalse}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="no" onClick={this.handleFalse} color="primary">
              Nein
            </Button>
            <Button
              id="yes"
              onClick={this.handleTrue}
              color="primary"
              autoFocus
            >
              Ja
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;
