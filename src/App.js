import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import { CssBaseline, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: red[600],
      main: grey[800],
      dark: grey[900],
    },
    secondary: {
      light: red[600],
      main: red[600],
      dark: red[800],
    },
    type: 'dark'
  }
})

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Grid container justify="center" style={{flexGrow: 1}}>
          <Grid item xs={11} md={10} lg={8}>
            <Login />
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
