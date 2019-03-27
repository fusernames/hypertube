import React, { Component } from 'react'
import { Route } from "react-router-dom"
import { connect } from 'react-redux'
import { CssBaseline, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { grey, indigo, red, blue, deepOrange } from '@material-ui/core/colors';
import Navbar from './components/navbar/Navbar'
import Join from './components/join/Join'
import Home from './components/home/Home'
import Notifier from './imported/Notifier'
import Movie from './components/movie/Movie'
import Account from './components/account/Account'
import Profile from './components/profile/Profile'
import LoggedRoute from './utils/routes/LoggedRoute'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: deepOrange[400],
      main: deepOrange[400],
      dark: deepOrange[500]
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

  componentDidMount() {
    document.title = 'Hypertube'
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Notifier />
        <Navbar />
        <Grid container justify="center" style={{marginTop: '90px', marginBottom:'20px'}}>
          <Grid item xs={11} md={10} lg={8} xl={7}>
            <Route exact path="/" component={Home} />
            <LoggedRoute path="/movie/:id" component={Movie} />
            <LoggedRoute path="/user/:id" component={Profile} />
            <LoggedRoute path="/account" component={Account} />
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
