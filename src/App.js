import React, { Component } from 'react'
import Navbar from './components/navbar/Navbar'
import CssBaseline from '@material-ui/core/CssBaseline'


class App extends Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <Navbar />
      </div>
    )
  }
}

export default App
