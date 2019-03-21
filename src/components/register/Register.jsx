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
    const { locale } = this.props.locales

    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <TextField
              name="username"
              label={locale.global.username}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstname"
              label={locale.global.firstname}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastname"
              label={locale.global.lastname}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="email"
              name="email"
              label={locale.global.email}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="password"
              name="password"
              label={locale.global.password}
              onChange={this.onChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="password"
              name="repassword"
              label={locale.global.repassword}
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
          {locale.register.btn}
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

function mapStateToProps(state) {
  return state
}

let RegisterExport = Register
RegisterExport = withStyles(styles)(RegisterExport)
RegisterExport = connect(mapStateToProps)(RegisterExport)
export default RegisterExport
