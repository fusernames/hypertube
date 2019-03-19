const initialState = {
  currentUser: {}
};

function rootReducer(state = initialState, action) {
  if (action == 'LOGIN') {
    return Object.assign({}, state, {
      currentUser: action.payload
    });
  }
}

export default rootReducer
