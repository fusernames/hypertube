import store from '../redux/store'
import { enqueueSnackbar } from '../redux/snackbars/actions'
import Cookies from 'js-cookie'

const req = (url, options) => {
  let params = {
    headers: {}
  }
  // options
  if (options) {
    // method
    if (options.method) params.method = options.method
    // content type
    if (options.contentType) params.headers = {'Content-Type': options.contentType}
    else if (options.contentType === false) ;
    else if (options.body) params.headers = {'Content-Type': 'application/json'}
    // body
    if (options.body)
      params.body = params.headers['Content-Type'] === 'application/json' ? JSON.stringify(options.body) : options.body
    // token
    if (options.useToken)
      params.headers = {...params.headers, Authorization: 'Bearer ' + Cookies.get('jwt')}
  }
  return new Promise((resolve, reject) => {
    fetch(url, params)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          json._status = response.status
          resolve(json)
        }).catch(err => {
          store.dispatch(enqueueSnackbar('AJAX_ERROR', 'error'))
        })
      } else {
        if (response.status >= 500) {
          store.dispatch(enqueueSnackbar(response.statusText, 'error'))
          reject({_status: response.status})
        }
        response.json().then(json => {
          json._status = response.status
          reject(json)
        }).catch(err => {
          store.dispatch(enqueueSnackbar('AJAX_ERROR', 'error'))
        })
      }
    })
    .catch(err => {
      store.dispatch(enqueueSnackbar(err.message, 'error'))
      reject(err)
    })
  })
}

export default req
