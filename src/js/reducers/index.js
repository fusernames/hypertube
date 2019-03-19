const initialState = {
  currentUser: undefined
};

function rootReducer(state = initialState, action) {
  if (action.type === 'LOGIN') {
    return Object.assign({}, state, {
      currentUser: action.payload
    });
  }
  else {
    return state;
  }
}

export default rootReducer
