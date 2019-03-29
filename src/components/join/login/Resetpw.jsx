import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core'
import { connect } from 'react-redux'

class Resetpw extends React.Component {

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
              label={locale.global.email}
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleResetpw} color="primary">
              {locale.global.cancel}
            </Button>
            <Button onClick={toggleResetpw} color="primary">
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
