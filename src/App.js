import React, { Component } from 'react'
import { Route } from "react-router-dom"
import { connect } from 'react-redux'
import { CssBaseline, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { grey, blue } from '@material-ui/core/colors';
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import Notifier from './imported/Notifier'
import Movie from './components/movie/Movie'
import Account from './components/account/Account'
import Profile from './components/profile/Profile'
import LoggedRoute from './utils/jsx/LoggedRoute'
import UnloggedRoute from './utils/jsx/UnloggedRoute'
import { getCurrentUser } from './redux/auth/actions'
import OAuth from './components/oauth/OAuth'
import Stream from './components/stream/Stream'
import ResetPassword from './components/reset/ResetPassword'
import Movies from './components/movies/Movies'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[400],
      main: blue[400],
      dark: blue[500]
    },
    secondary: {
      light: grey[700],
      main: grey[800],
      dark: grey[900],
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  },
})

class App extends Component {

  componentWillMount() {
    document.title = 'Hypertube'
    const { dispatch } = this.props
    dispatch(getCurrentUser())
  }

  render() {
    const { auth } = this.props
    if (auth.logged === undefined) return null
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Notifier />
        <Navbar />
        <Grid container justify="center" style={{marginTop: '90px', marginBottom:'20px'}}>
          <Grid item xs={11} md={10} lg={8} xl={7}>
            <Route exact path="/" component={Home} />
            <Route path="/oauth/:name" component={OAuth} />
            <UnloggedRoute path="/reset_pw/:token" component={ResetPassword} />
            <LoggedRoute path="/movie/:id" component={Movie} />
            <LoggedRoute path="/movies" component={Movies} />
            <LoggedRoute path="/user/:id" component={Profile} />
            <LoggedRoute path="/account" component={Account} />
            <LoggedRoute path="/stream/:id" component={Stream} />
          </Grid>
        </Grid>
      </MuiThemeProvider>
    )
  }
}


const mapStateToProps = state => {
  return state;
}

let AppExport = connect(mapStateToProps)(App)
export default AppExport
