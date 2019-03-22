import { enqueueSnackbar } from '../snackbars/actions'
import history from '../../utils/history'

export function login(data) {
  let username = data.username
  let password = data.password
  let locale
  return (dispatch, getState) => {
    locale = getState().locales.locale
    dispatch(success(dispatch))
  }

  function success(dispatch) {
    dispatch(enqueueSnackbar(locale.alerts.LOGIN_SUCCESS, 'success'))
    history.push('/');
    return {type: 'LOGIN_SUCCESS', user: data}
  }
}

export function logout() {
  return {type: 'LOGOUT'}
}
