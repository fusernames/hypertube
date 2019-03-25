import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { login } from '../../redux/auth/actions'
import { indigo, red, blue, grey } from '@material-ui/core/colors'

const twitter = createMuiTheme({palette: {primary:blue}})
const facebook = createMuiTheme({palette: {primary: { main: indigo['A200'] }}})
const google = createMuiTheme({palette: {primary: { main: red[400] }}})
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

  openWindow = (name) => {
    let openedWindow = undefined
    if (name === "42") {
      openedWindow = window.open('https://api.intra.42.fr/oauth/authorize?client_id=410d148df61a4dc6e462bba98b4beda91b3bb56582a44a2a29775a9e0e3cb2d9&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code', '42', 'status=1')
      openedWindow.addEventListener('load', () => {
        console.log(openedWindow.location.href)
        openedWindow.close();
        // Pue sa mère faut que je bosse ici
      });
    } else if (name === "Twitter" && false) {
      openedWindow = window.open('Manque url twitter', 'Twitter', 'status=1')
      openedWindow.addEventListener('load', () => {
        console.log(openedWindow.location.href)
        openedWindow.close();
        // Pue sa mère faut que je bosse ici
      });
    } else if (name === "Facebook") {
      openedWindow = window.open('https://www.facebook.com/v3.2/dialog/oauth?client_id=915807418753565&redirect_uri=http://localhost:3000/&display=popup&response_type=token', 'Facebook', 'status=1')
      openedWindow.addEventListener('load', () => {
        console.log(openedWindow.location.href)
        openedWindow.close();
        // Pue sa mère faut que je bosse ici
      });
    } else if (name === "Github") {
      openedWindow = window.open('https://github.com/login/oauth/authorize?client_id=419e2d89b672ff004243', 'Github', 'status=1')
      openedWindow.addEventListener('load', () => {
        console.log(openedWindow.location.href)
        openedWindow.close();
        // Pue sa mère faut que je bosse ici
      });
    } else if (name === "Gmail" && false) {
      openedWindow = window.open('Manque url gmail', 'Gmail', 'status=1')
      openedWindow.addEventListener('load', () => {
        console.log(openedWindow.location.href)
        openedWindow.close();
        // Pue sa mère faut que je bosse ici
      });
    } else {
      console.log("Error opening OAuth for", name)
    }
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
              <Button variant="contained" color="primary" onClick={() => this.openWindow("42")} fullWidth>
                42
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiThemeProvider theme={twitter}>
              <Button variant="contained" color="primary" onClick={() => this.openWindow("Twitter")} fullWidth>
                Twitter
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
const mapStateToProps = state => {
  return state
}
let LoginExport = Login
LoginExport = withStyles(styles)(LoginExport)
LoginExport = connect(mapStateToProps)(LoginExport)

export default LoginExport
