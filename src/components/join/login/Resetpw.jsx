import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import req from '../../../utils/req'
import api from '../../../config'
import { alert } from '../../../redux/snackbars/actions'

class Resetpw extends React.Component {

  state = {
    email: '',
  }

  handleSubmit = () => {
    const { toggleResetpw, dispatch } = this.props
    req(api + '/users/reset-password/send-email', {
      method: 'post',
      body: {email: this.state.email}
    })
    .then(res => {
      dispatch(alert('RESET_SENT', 'success'))
    })
    .catch(err => {
      if (err.status === 403)
        dispatch(alert('USER_NOT_FOUND', 'error'))
    })
    toggleResetpw();
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    const { open, toggleResetpw, locales } = this.props
    const { locale } = locales
    return (
      <div>
        <Dialog
          open={open}
          onClose={toggleResetpw}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">{locale.resetpw.title}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label={locale.global.email}
              type="email"
              onChange={this.onChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleResetpw} color="default">
              {locale.global.cancel}
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              {locale.global.send}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

Resetpw = connect(state => state)(Resetpw)
export default Resetpw
