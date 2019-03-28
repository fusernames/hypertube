import { enqueueSnackbar } from '../snackbars/actions'
import req from '../../utils/req'

export function login(data) {
  let locale
  data.email = data.username

  return (dispatch, getState) => {
    locale = getState().locales.locale
    req('http://35.181.48.142/api/login_check', {
      method: 'post', body: data
    })
    .then(res => {
      data.token = res.token
      localStorage.setItem('token', res.token)
      dispatch(loginSuccess(dispatch))
    })
  }

  function loginSuccess(dispatch) {
    dispatch(enqueueSnackbar(locale.alerts.LOGIN_SUCCESS, 'success'))
    return {type: 'LOGIN_SUCCESS', user: data}
  }
}

export function logout() {
  localStorage.removeItem('token')
  return {type: 'LOGOUT'}
}

export function fetchCurrentUser(id) {
  req('http://35.181.48.142/api/users/me')
  .then(res => {

  })
}
