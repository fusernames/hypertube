const initialState = {
  word: '',
  movies: [],
  page: '',
  genre: '',
  sort: '',
  api: 'yts',
  isFetching: false
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
