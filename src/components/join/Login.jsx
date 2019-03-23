import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { login } from '../../redux/auth/actions'
import { indigo, red, blue, grey } from '@material-ui/core/colors'

const twitter = createMuiTheme({palette: {primary:blue}})
const facebook = createMuiTheme({palette: {primary: { main: indigo['A200'] }}})
const ft = createMuiTheme({palette: {primary: {light: grey[700], main: grey[900], dark: grey[900]}}})

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
    e.preventDefault()
  }

  render () {
    const { classes } = this.props
    const { locale } = this.props.locales

    return (
      <div>
        <Typography color="primary" variant="h5">{locale.login.title}</Typography>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label={locale.global.username}
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
                label={locale.global.password}
                value={this.state.password}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            style={{margin:'10px 0'}}
            type="submit"
            variant="outlined"
            color="primary"
            fullWidth
          >
            {locale.login.btn}
          </Button>
        </form>
        <Grid container spacing={8} justify="center">
          <Grid item xs={12} sm={6}>
            <MuiThemeProvider theme={ft}>
              <Button variant="contained" color="primary" fullWidth>
                42
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiThemeProvider theme={twitter}>
              <Button variant="contained" color="primary" fullWidth>
                Twitter
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiThemeProvider theme={facebook}>
              <Button variant="contained" color="primary" fullWidth>
                Facebook
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="default" fullWidth>
              Github
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth>
              Gmail
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = {

}
const mapStateToProps = state => {
  return state
}
let LoginExport = Login
LoginExport = withStyles(styles)(LoginExport)
LoginExport = connect(mapStateToProps)(LoginExport)

export default LoginExport
