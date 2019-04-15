import store from '../store'
import req from '../../utils/req'
import { alert } from '../snackbars/actions'
import host from '../../config'
import urlencode from 'urlencode'

export function fetchMyMovies() {
  return (dispatch, getState) => {
    const { auth } = getState()
    req(host + '/api/movie_statuses.json?&user.id=' + auth.user.id, {
      useToken: true
    }).then(res => {
      dispatch(setMyMovies(res))
    })
  }
  function setMyMovies(myMovies) {
    return {
      type: 'SET_MY_MOVIES',
      myMovies: myMovies
    }
  }
}

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
  const { movies } = store.getState().search
  if (!set) {
    for (let i in movies) {
      if (movies[i]) {
        if (movies[i].code === code)
          return true
      }
    }
  }
  for (let i in list) {
    if (list[i]) {
      if (list[i].code === code)
        return true
    }
  }
  return false
}

export function formatMovies(list, callback, set = false) {
  let movies = []
  let movie = {}

  for(let i in list) {
    if (list[i].images && list[i].images.banner) {
      movie = {
        image: list[i].images.poster,
        title: list[i].title,
        id: list[i].imdb_id,
        code: list[i].imdb_id,
        year: list[i].year,
        rating: list[i].rating.percentage / 10,
      }
    } else if (list[i].medium_cover_image) {
      movie = {
        image: list[i].medium_cover_image,
        title: list[i].title,
        code: list[i].imdb_code,
        id: list[i].id.toString(),
        year: list[i].year,
        rating: list[i].rating,
      }
    }
    if (movie.id && !exists(movie.code, movies, set)) {
      movies.push(movie)
    }
  }
  callback(movies)
}

export function fetchMovies(options = {}) {
  return (dispatch, getState) => {

    let { word, genre, sort, api } = options
    let search = getState().search
    if (sort === undefined && (word !== undefined || genre !== undefined)) sort = 'title'
    if (word === undefined) word = search.word
    if (genre === undefined) genre = search.genre
    if (sort === undefined) sort = search.sort
    if (api === undefined) api = search.api
    word = urlencode(word)
    let list = []

    if (api === 'popcorntime' || api === 'yts') {
      dispatch(setOptions(word, genre, sort, api))
    }
    if (api === 'popcorntime') {
      let url = 'https://tv-v2.api-fetch.website/movies/1?'
      if (word) url += '&keywords=' + word
      if (genre) url += '&genre=' + genre
      if (sort) url += '&sort=' + sort
      if (sort === 'title') url += '&order=1'
      dispatch(fetching())
      req(url).then(res => {
        formatMovies(res, (movies) => {
          dispatch(setMovies(movies))
        }, true)
      }).catch(err => {
        dispatch(alert('API_ERROR', 'error'))
      })
    } else if (api === 'yts') {
      let url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=40'
      if (word) url += '&query_term=' + word
      if (genre) url += '&genre=' + translateGenre(genre)
      if (sort) url += '&sort_by=' + sort
      if (sort === 'title') url += '&order_by=asc'
      dispatch(fetching())
      req(url).then(res => {
        if (res.data.movies)
          list = res.data.movies
        formatMovies(list, (movies) => {
          dispatch(setMovies(movies))
        }, true)
      }).catch(err => {
        dispatch(alert('API_ERROR', 'error'))
      })
    }
  }
}

export function fetchAddMovies() {
  return (dispatch, getState) => {
    let list = []
    let search = getState().search
    if (search.isFetching || search.finished) return

    if (search.api === 'popcorntime') {
      let url = 'https://tv-v2.api-fetch.website/movies/' + (search.page + 1) + '?'
      if (search.word) url += '&keywords=' + search.word
      if (search.genre) url += '&genre=' + search.genre
      if (search.sort) url += '&sort=' + search.sort
      if (search.sort === 'title') url += '&order=1'
      dispatch(fetching())
      req(url).then(res => {
        formatMovies(res, (movies) => {
          dispatch(addMovies(movies))
        })
      }).catch(err => {
        dispatch(alert('API_ERROR', 'error'))
      })
    } else if (search.api === 'yts') {
      let url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=40&page=' + (search.page + 1)
      if (search.word) url += '&query_term=' + search.word
      if (search.genre) url += '&genre=' + translateGenre(search.genre)
      if (search.sort) url += '&sort_by=' + search.sort
      if (search.sort === 'title') url += '&order_by=asc'
      dispatch(fetching())
      req(url).then(res => {
        if (res.data.movies)
          list = res.data.movies
        formatMovies(list, (movies) => {
          dispatch(addMovies(movies))
        })
      }).catch(err => {
        dispatch(alert('API_ERROR', 'error'))
      })
    }
  }
}

export function addMovies(res) {
  let finished = false
  if (res.length === 0)
    finished = true
  return {
    type: 'ADD_MOVIES',
    movies: res,
    finished: finished
  }
}

export function setMovies(movies) {
  return {
    type: 'SET_MOVIES',
    movies: movies,
  }
}

export function setOptions(word, genre, sort, api) {
  return {
    type: 'SET_OPTIONS',
    word: word,
    genre: genre,
    sort: sort,
    api: api,
  }
}

export function fetching() {
  return {
    type: 'SEARCH_FETCHING'
  }
}
