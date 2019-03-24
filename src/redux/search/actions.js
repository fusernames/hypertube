import store from '../store'

export function exists(title, list) {
  for (let i in list) {
    if (list[i].title == title)
      return true
  }
  const { movies } = store.getState().search
  for (let i in title) {
    if (movies[i]) {
      if (movies[i].title == title)
        return true
    }
  }
  return false
}

export function formatMovies(list, callback) {
  let movies = []
  let title = ''
  let image = ''
  for(let i in list) {
    if (list[i].images && list[i].images.banner) {
      image = list[i].images.banner
      title = list[i].title
    } else if (list[i].large_cover_image) {
      image = list[i].large_cover_image
      title = list[i].title
    } else {
      title = ''
      image = ''
    }
    if (title && image && !exists(title, movies)) {
      movies.push({
        image: image,
        title: title
      })
    }
  }
  callback(movies)
}

export function fetchMovies(word) {
  return (dispatch) => {
    let list = []
    let url = 'https://tv-v2.api-fetch.website/movies/1'
    if (word) url += '?keywords=' + word
    dispatch(fetching())
    fetch(url).then(res => res.json()).then(json => {
      list.push(...json)
      url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=30'
      if (word) url += '&query_term=' + word
      fetch(url).then(res => res.json()).then(json => {
        if (json.data.movies)
          list.push(...json.data.movies)
        formatMovies(list, (movies) => {
          dispatch(setMovies(movies, word))
        })
      })
    })
  }
}

export function fetchAddMovies() {
  return (dispatch, getState) => {
    let list = []
    let search = getState().search
    let url = 'https://tv-v2.api-fetch.website/movies/' + search.page + 1
    if (search.word) url += '?keywords=' + search.word
    if (search.isFetching) return
    else {
      dispatch(fetching())
    }
    fetch(url).then(res => res.json()).then(json => {
      list.push(...json)
      url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=30&page=' + search.page
      if (search.word) url += '&query_term=' + search.word
      fetch(url).then(res => res.json()).then(json => {
        if (json.data.movies)
          list.push(...json.data.movies)
        formatMovies(list, (movies) => {
          dispatch(addMovies(movies))
        })
      })
    })
  }
}

export function addMovies(res) {
  return {
    type: 'ADD_MOVIES',
    movies: res
  }
}

export function setMovies(res, word) {
  return {
    type: 'SET_MOVIES',
    word: word,
    movies: res,
  }
}

export function fetching() {
  return {
    type: 'FETCHING'
  }
}
