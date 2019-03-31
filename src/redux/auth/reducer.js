const initialState = {
  user: undefined,
  logged: undefined,
  isFetching: false,
}

function authReducer(state = initialState, action) {
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: undefined,
      logged: false,
      isFetching: false,
    }
  } else if (action.type === 'SET_CURRENT_USER') {
    return {
      isFetching: false,
      user: action.user,
      logged: action.logged,
    }
  } else if (action.type === 'AUTH_FETCHING') {
    return {
      ...state,
      isFetching: action.state
    }
  } else {
    return state
  }
}

export default authReducer
