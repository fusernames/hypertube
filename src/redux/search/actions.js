import store from '../store'

function translateGenre(genre) {
  switch(genre) {
    case 'science-fiction':
      return 'sci-fi'
    case 'sports':
      return 'sport'
    default:
      return genre
  }
}

export function exists(code, list, set = false) {
  for (let i in list) {
    if (list[i].code == code)
      return true
  }
  const { movies } = store.getState().search
  if (!set) {
    for (let i in movies) {
      if (movies[i]) {
        if (movies[i].code == code)
          return true
      }
    }
  }
  return false
}

export function formatMovies(list, callback, set = false) {
  let movies = []
  let title = ''
  let image = ''
  let id = ''
  let code = ''

  for(let i in list) {
    if (list[i].images && list[i].images.banner) {
      image = list[i].images.poster
      title = list[i].title
      id = list[i].imdb_id
      code = list[i].imdb_id
    } else if (list[i].medium_cover_image) {
      image = list[i].medium_cover_image
      title = list[i].title
      code = list[i].imdb_code
      id = list[i].id
    } else {
      id = ''
    }
    if (id && !exists(code, movies, set)) {
      movies.push({
        id: id,
        code: code,
        image: image,
        title: title
      })
    }
  }
  callback(movies)
}

export function fetchMovies(options = {}) {
  return (dispatch, getState) => {

    let { word, genre } = options
    let search = getState().search
    if (word === undefined) word = search.word
    if (genre === undefined) genre = search.genre

    let list = []
    let url = 'https://tv-v2.api-fetch.website/movies/1?'
    if (word) url += '&keywords=' + word
    if (genre) url += '&genre=' + genre
    dispatch(fetching())
    fetch(url).then(res => res.json()).then(json => {
      list = [...json]
      url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=30'
      if (word) url += '&query_term=' + word
      if (genre) url += '&genre=' + translateGenre(genre)
      fetch(url).then(res => res.json()).then(json => {
        if (json.data.movies)
          list = [...json.data.movies, ...list]
        formatMovies(list, (movies) => {
          dispatch(setMovies(movies, word, genre))
        }, true)
      })
    })
  }
}

export function fetchAddMovies() {
  return (dispatch, getState) => {
    let list = []
    let search = getState().search

    let url = 'https://tv-v2.api-fetch.website/movies/' + search.page + 1 + '?'
    if (search.word) url += '&keywords=' + search.word
    if (search.genre) url += '&genre=' + search.genre
    if (search.isFetching) return
    else {
      dispatch(fetching())
    }
    fetch(url).then(res => res.json()).then(json => {
      list = [...json]
      url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=40&page=' + search.page
      if (search.word) url += '&query_term=' + search.word
      if (search.genre) url += '&genre=' + translateGenre(search.genre)
      fetch(url).then(res => res.json()).then(json => {
        if (json.data.movies)
          list = [...json.data.movies, ...list]
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

export function setMovies(res, word, genre) {
  return {
    type: 'SET_MOVIES',
    word: word,
    movies: res,
    genre: genre
  }
}

export function fetching() {
  return {
    type: 'FETCHING'
  }
}
