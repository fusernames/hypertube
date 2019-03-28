const initialState = {
  user: undefined,
  logged: undefined,
}

function authReducer(state = initialState, action) {
  if (action.type === 'LOGOUT') {
    return {
      user: undefined,
      logged: false,
    }
  } else if (action.type === 'SET_CURRENT_USER') {
    return {
      user: action.user,
      logged: action.logged,
    }
  } else {
    return state
  }
}

export default authReducer
