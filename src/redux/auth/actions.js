import { enqueueSnackbar } from '../snackbars/actions'
import req from '../../utils/req'
import Cookies from 'js-cookie'
import api from '../../config'

export function login(data, callback) {

  data.email = data.username
  let auth = {}

  return (dispatch, getState) => {
    const { locale } = getState().locales
    req(api + '/login_check', {
      method: 'post', body: data
    })
    .then(res => {
      auth.token = res.token
      Cookies.set('jwt', auth.token)
      dispatch(getCurrentUser())
      dispatch(enqueueSnackbar(locale.alerts.LOGIN_SUCCESS, 'success'))
      if (callback) callback()
    })
  }
}

export function logout() {
  Cookies.remove('jwt')
  return {
    type: 'LOGOUT'
  }
}

export function getCurrentUser() {
  return (dispatch) => {
    if (Cookies.get('jwt')) {
      req(api + '/users/me', {token: true})
      .then(res => {
        dispatch(setCurrentUser(res))
      })
      .catch(err => {
        dispatch(logout())
      })
    } else {
      dispatch(setCurrentUser())
    }
  }

  function setCurrentUser(user) {
    return {
      type: 'SET_CURRENT_USER',
      user: user,
      logged: user ? true : false,
    }
  }
}
