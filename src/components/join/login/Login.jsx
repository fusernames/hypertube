import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { TextField, Button, Grid, Typography, Link } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { login } from '../../../redux/auth/actions'
import { indigo, red, blue, grey } from '@material-ui/core/colors'
import AskReset from './AskReset'

// theme colors
const twitter = createMuiTheme({typography: {useNextVariants: true}, palette: {primary:blue}})
const facebook = createMuiTheme({typography: {useNextVariants: true}, palette: {primary: { main: indigo['A200'] }}})
const google = createMuiTheme({typography: {useNextVariants: true}, palette: {primary: { main: red[400] }}})
const ft = createMuiTheme({typography: {useNextVariants: true}, palette: {primary: {light: grey[700], main: grey[900], dark: grey[900]}}})

class Login extends React.Component {

  state = {
    username: '',
    password: '',
    openAskReset: false
  }

  toggleAskReset = () => {
    this.setState({...this.state, openAskReset: !this.state.openAskReset})
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props

    dispatch(login(this.state))
    e.preventDefault()
  }

  openWindow = (name) => {
    if (name === "42") {
      window.location = 'https://api.intra.42.fr/oauth/authorize?client_id=410d148df61a4dc6e462bba98b4beda91b3bb56582a44a2a29775a9e0e3cb2d9&redirect_uri=https%3A%2F%2Fhypertube.barthonet.ovh%2Foauth%2F42&response_type=code';
    } else if (name === "Trello") {
      window.location = 'https://trello.com/1/authorize?expiration=1day&name=Hypertube&scope=read&response_type=token&key=f6543a57156d53fff214955eb886d264&return_url=https://hypertube.barthonet.ovh/oauth/trello&scope=account';
    } else if (name === "Facebook") {
      window.location = 'https://www.facebook.com/v3.2/dialog/oauth?client_id=915807418753565&redirect_uri=https://hypertube.barthonet.ovh/oauth/facebook/&display=popup&response_type=token&scope=email';
    } else if (name === "Github") {
      window.location = 'https://github.com/login/oauth/authorize?client_id=419e2d89b672ff004243';
    } else if (name === "Gmail") {
      window.location = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=39760124824-ehshl281mip2ejm0f9l5vkgdb672j16g.apps.googleusercontent.com&response_type=code&redirect_uri=https://hypertube.barthonet.ovh/oauth/gmail&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly&access_type=offline';
    }
  }

  render () {
    const { locale } = this.props.locales

    return (
      <div>
        <AskReset open={this.state.openAskReset} toggleAskReset={this.toggleAskReset}/>
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
          <Typography>
            <Link onClick={this.toggleAskReset} style={{cursor: 'pointer'}}>{locale.login.forgot_password}</Link>
          </Typography>
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
              <Button variant="contained" color="primary" onClick={() => this.openWindow("42")} fullWidth>
                42
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiThemeProvider theme={twitter}>
              <Button variant="contained" color="primary" onClick={() => this.openWindow("Trello")} fullWidth>
                Trello
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiThemeProvider theme={facebook}>
              <Button variant="contained" color="primary" onClick={() => this.openWindow("Facebook")} fullWidth>
                Facebook
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="default" onClick={() => this.openWindow("Github")} fullWidth>
              Github
            </Button>
          </Grid>
            <Grid item xs={12} sm={6}>
              <MuiThemeProvider theme={google}>
                <Button variant="contained" color="primary" onClick={() => this.openWindow("Gmail")} fullWidth>
                  Gmail
                </Button>
              </MuiThemeProvider>
            </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = {

}
let LoginExport = Login
LoginExport = withStyles(styles)(LoginExport)
LoginExport = connect(state => state)(LoginExport)

export default LoginExport
