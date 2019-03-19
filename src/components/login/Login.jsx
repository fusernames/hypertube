import React from 'react'
import { TextField, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from "react-redux"

class Login extends React.Component {

  state = {
    username: '',
    password: '',
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  render () {
    const { classes } = this.props;
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
        <Button variant="contained" color="primary" className={classes.button}>
          Log in
        </Button>
      </form>
    )
  }
}

const styles = theme => ({
  button: {

  },
})

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  : () => dispatch(startAction)
});

export default connect()(withStyles(styles)(Login))
