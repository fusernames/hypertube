import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './redux/store'
import { SnackbarProvider } from 'notistack'
import { Button } from '@material-ui/core'

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider action={[
        <Button color="inherit" size="small">{'OK'}</Button>
    ]}>
      <App />
    </SnackbarProvider>
  </Provider>
  , document.getElementById('root')
)
