const initialState = {
  user: undefined,
  logged: undefined
}

function authReducer(state = initialState, action) {
  if (action.type === 'LOGIN_SUCCESS') {
    return {
      user: action.user,
      logged: true
    }
  }
  else if (action.type === 'LOGOUT') {
    return {
      user: undefined,
      logged: false
    }
  } else if (action.type === 'IS_LOGGED') {
    return {
      user: action.user,
      logged: true
    }
  } else {
    return state
  }
}

export default authReducer
