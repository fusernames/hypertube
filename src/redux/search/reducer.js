const initialState = {
  word: '',
  movies: [],
  page: 1,
  genre: '',
  sort: '',
  api: 'yts',
  isFetching: false,
  finished: false,
  myMovies: []
}

function searchReducer(state = initialState, action) {
  if (action.type === 'SEARCH_FETCHING') {
    return {
      ...state,
      isFetching: true
    }
  } else if (action.type === 'SET_MOVIES') {
    return {
      ...state,
      movies: action.movies,
      isFetching: false,
      finished: false
    }
  } else if (action.type === 'SET_OPTIONS') {
    return {
      ...state,
      page: 1,
      word: action.word,
      genre: action.genre,
      sort: action.sort,
      api: action.api
    }
  } else if (action.type === 'ADD_MOVIES') {
    return {
      ...state,
      movies: [
        ...state.movies,
        ...action.movies
      ],
      page: state.page + 1,
      isFetching: false,
      finished: action.finished
    }
  } else if (action.type === 'SET_MY_MOVIES') {
    return {
      ...state,
      myMovies: action.myMovies
    }
  } else {
    return state
  }

}

export default searchReducer
