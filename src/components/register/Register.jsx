import React from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

class Register extends React.Component {

  state = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    repassword: ''
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
  }

  render () {
    const { classes } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <TextField
              name="username"
              label="Username"
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstname"
              label="Firstname"
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastname"
              label="Lastname"
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="email"
              name="email"
              label="Email"
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="password"
              name="password"
              label="Password"
              value={this.state.password}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="password"
              name="repassword"
              label="Repeat password"
              value={this.state.password}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}>
          Log in
        </Button>
      </form>
    )
  }
}

const styles = {
  button: {
    marginTop: '5px'
  }
}

const mapStateToProps = state => {
  return state
}

let RegisterExport = Register
RegisterExport = withStyles(styles)(RegisterExport)
RegisterExport = connect(mapStateToProps)(RegisterExport)

export default RegisterExport
