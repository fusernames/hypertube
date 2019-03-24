const initialState = {
  word: '',
  movies: [],
  page: '',
  isFetching: false
}

function searchReducer(state = initialState, action) {
  if (action.type === 'FETCHING') {
    return {
      ...state,
      isFetching: true
    }
  } else if (action.type === 'SET_MOVIES') {
    return {
      word: action.word,
      movies: action.movies,
      page: 1,
      isFetching: false,
    }
  } else if (action.type === 'ADD_MOVIES') {
    console.log(action.movies)
    return {
      ...state,
      movies: [
        ...state.movies,
        ...action.movies
      ],
      page: state.page + 1,
      isFetching: false,
    }
  } else {
    return state
  }

}

export default searchReducer
