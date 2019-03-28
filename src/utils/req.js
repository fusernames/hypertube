import store from '../redux/store'
import { enqueueSnackbar } from '../redux/snackbars/actions'
import Cookies from 'js-cookie'

const req = (url, options) => {
  let params = {}
  // options
  if (options) {
    console.log('body', options.body)
    // method
    if (options.method) params.method = options.method
    // body
    if (options.body) params.body = JSON.stringify(options.body)
    // content type
    if (options.contentType) params.headers = {'Content-Type': options.contentType}
    else if (options.body) params.headers = {'Content-Type': 'application/json'}
    // token
    if (options.token)
      params.headers = {...params.headers, Authorization: 'Bearer ' + Cookies.get('jwt')}
  }
  return new Promise((resolve, reject) => {
    console.log('params', params)
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
