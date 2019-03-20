import React from 'react'
import { TextField, Button, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { login } from '../../js/auth/auth.actions'

class Login extends React.Component {

  state = {
    username: '',
    password: '',
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props
    dispatch(login(this.state))
    console.log(this.props.auth)
    e.preventDefault()
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
              value={this.state.username}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
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

let LoginExport = Login
LoginExport = withStyles(styles)(LoginExport)
LoginExport = connect(mapStateToProps)(LoginExport)

export default LoginExport
