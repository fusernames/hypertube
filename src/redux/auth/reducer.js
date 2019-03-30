const initialState = {
  user: undefined,
  logged: undefined,
  isFetching: false,
}

function authReducer(state = initialState, action) {
  if (action.type === 'LOGOUT') {
    return {
      user: undefined,
      logged: false,
      isFetching: false,
    }
  } else if (action.type === 'SET_CURRENT_USER') {
    return {
      user: action.user,
      logged: action.logged,
      isFetching: false
    }
  } else if (action.type === 'AUTH_FETCHING') {
    return {
      ...state,
      isFetching: true
    }
  } else {
    return state
  }
}

export default authReducer
