const initialState = {
  notifications: []
}

function snackbarsReducer(state = initialState, action) {
  if (action.type === 'ENQUEUE_SNACKBAR') {
    return {
      notifications: [
        ...state.notifications,
        action.notification
      ]
    }
  } else if (action.type === 'REMOVE_SNACKBAR') {
    return {
      notifications: state.notifications.filter(
        notification => notification.key !== action.key,
      ),
    }
  } else {
    return state;
  }
}

export default snackbarsReducer
