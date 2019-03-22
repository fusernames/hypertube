import React, { Component } from 'react'
import { Route } from "react-router-dom";
import { connect } from 'react-redux'
import { CssBaseline, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { grey, indigo, red } from '@material-ui/core/colors';
import Navbar from './components/navbar/Navbar'
import Join from './components/join/Join'
import Home from './components/home/Home'
import Notifier from './imported/Notifier'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: red[300],
      main: red[400],
      dark: red[500]
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
        <Grid container justify="center" style={{marginTop: '90px'}}>
          <Grid item xs={11} md={10} lg={8}>
            <Route path="/" component={Home} />
            <Route path="/join" component={Join} />
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
