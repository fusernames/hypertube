import React from 'react'
import { TextField, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { login } from '../../js/actions/index.js'

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
    console.log(this.props)
    e.preventDefault()
  }

  render () {
    const { classes } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="username"
          label="Username"
          value={this.state.username}
          onChange={this.onChange}
          margin="normal"
          fullWidth
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          value={this.state.password}
          onChange={this.onChange}
          margin="normal"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
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
