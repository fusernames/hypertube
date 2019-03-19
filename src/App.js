import React, { Component } from 'react'
import Navbar from './components/navbar/Navbar'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <CssBaseline />
          <Navbar />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
