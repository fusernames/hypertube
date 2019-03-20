import React, { Component } from 'react'
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from 'react-redux'
import { CssBaseline, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Home from './components/home/Home'

const theme = createMuiTheme({
  palette: {
    secondary : grey,
    type: 'dark'
  }
})

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Grid container justify="center" style={{flexGrow: 1}}>
            <Grid item xs={11} md={10} lg={8}>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

let AppExport = connect(mapStateToProps)(App)
export default AppExport
