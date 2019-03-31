import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Grid, Typography } from '@material-ui/core'

class Resetpw extends Component {

  state = {
    password: '',
    repassword: ''
  }

  onChange = (e) => {
    this.setState({...this.state, [e.target.name]: e.target.value})
  }

  render() {
    const { locale } = this.props.locales
    return (
      <div>
        <Typography color="primary" variant="h5">{locale.resetpw.title}</Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label={locale.global.password}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="repassword"
              label={locale.global.repassword}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>
        <Button style={{marginTop: '5px'}} variant="outlined" color="primary">{locale.resetpw.btn}</Button>
      </div>
    )
  }

}

export default connect(state => state)(Resetpw)
