import store from '../redux/store'
import { enqueueSnackbar } from '../redux/snackbars/actions'

const req = (url, body) => {
  let params = {}
  if (body) {
    params = {
      'Content-Type': 'application/json',
      body: JSON.stringify(body)
    }
  }
  return new Promise((resolve, reject) => {
    fetch(url, params)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          resolve(json)
        })
      } else {
        console.error(response.statusText)
        store.dispatch(enqueueSnackbar('error', response.statusText))
        reject()
      }
    })
    .catch(err => {
      store.dispatch(enqueueSnackbar('error', err))
      console.error(err)
      reject()
    })
  })
}

export default req
