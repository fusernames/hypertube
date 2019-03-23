const initialState = {
  word: '',
  results: [],
}

function searchReducer(state = initialState, action) {
  if (action.type === 'SEARCH') {
    return {
      word: action.word,
      results: action.results
    }
  } else {
    return state
  }
}

export default searchReducer
