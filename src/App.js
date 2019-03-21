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
import Notifier from './imported/Notifier'

const theme = createMuiTheme({
  palette: {
    secondary : grey,
    type: 'dark'
  }
})

class App extends Component {
  componentDidMount() {
    document.title = 'Hypertube'
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Notifier />
          <Navbar />
          <Grid container justify="center" style={{marginTop: '80px'}}>
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
