import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './redux/store'
import { SnackbarProvider } from 'notistack'
import { Button } from '@material-ui/core'
import { Router } from 'react-router'
import history from './utils/history'

let i = 0;

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider action={[
        <Button key={'OK' + i++} color="inherit" size="small">{'OK'}</Button>
    ]}>
      <Router history={history}>
        <App />
      </Router>
    </SnackbarProvider>
  </Provider>
  , document.getElementById('root')
)
