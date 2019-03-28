const initialState = {
  user: undefined,
  token: undefined,
  logged: undefined,
}

function authReducer(state = initialState, action) {
  if (action.type === 'LOGIN_SUCCESS') {
    return {
      user: action.user,
      token: action.token,
      logged: true,
    }
  }
  else if (action.type === 'LOGOUT') {
    return {
      user: undefined,
      token: undefined,
      logged: false,
    }
  } else if (action.type === 'IS_LOGGED') {
    return {
      user: action.user,
      token: action.token,
      logged: true,
    }
  } else {
    return state
  }
}

export default authReducer
