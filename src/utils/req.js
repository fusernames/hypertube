import store from '../redux/store'
import { enqueueSnackbar } from '../redux/snackbars/actions'

const req = (url, options) => {
  let params = {}
  if (options) {
    if (options.method) params.method = options.method
    if (options.body) params.body = JSON.stringify(options.body)
    if (options.contentType) params.headers = {'Content-Type': options.contentType}
    else if (options.body) params.headers = {'Content-Type': 'application/json'}
  }
  return new Promise((resolve, reject) => {
    fetch(url, params)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          resolve(json)
        })
      } else {
        response.json().then(json => console.error(json))
        store.dispatch(enqueueSnackbar(response.statusText, 'error'))
        reject()
      }
    })
    .catch(err => {
      store.dispatch(enqueueSnackbar(err, 'error'))
      console.error(err)
      reject()
    })
  })
}

export default req
