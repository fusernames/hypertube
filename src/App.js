import React, { Component } from 'react'
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import { CssBaseline, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
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

export default App
