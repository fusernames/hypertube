export function fetchMovies(word) {
  let url = 'https://tv-v2.api-fetch.website/movies/1'
  if (word)
    url += '?keywords=' + word
  return (dispatch) => {
    dispatch(fetching())
    fetch(url)
    .then(res => {
      return res.json()
    })
    .then(res => {
      dispatch(setMovies(res, word))
    })
  }
}

export function setMovies(res, word) {
  return {
    type: 'SET_MOVIES',
    word: word,
    movies: res,
  }
}

export function fetchAddMovies() {
  return (dispatch, getState) => {
    let search = getState().search
    let url = 'https://tv-v2.api-fetch.website/movies/' + search.page + 1

    if (search.isFetching) return
    dispatch(fetching())
    if (search.word)
      url += '?keywords=' + search.word
    fetch(url)
    .then(res => {
      return res.json()
    })
    .then(res => {
      dispatch(addMovies(res))
    })
  }
}

export function addMovies(res) {
  return {
    type: 'ADD_MOVIES',
    movies: res
  }
}

export function fetching() {
  return {
    type: 'FETCHING'
  }
}
