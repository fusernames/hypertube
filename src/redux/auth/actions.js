import { enqueueSnackbar } from '../snackbars/actions'
import history from '../../utils/history'

export function login(data) {
  let username = data.username
  let password = data.password
  return dispatch => {
    dispatch(success(dispatch))
  }

  function success(dispatch) {
    dispatch(enqueueSnackbar('test', 'success'))
    history.push('/');
    return {type: 'LOGIN_SUCCESS', user: data}
  }
}

export function logout() {
  return {type: 'LOGOUT'}
}
