import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Button, Menu, MenuItem } from '@material-ui/core'
import { fetchMovies } from '../../redux/search/actions'

class Sort extends Component {

  state = {
    anchorGenres: null,
    anchorSorts: null,
    anchorAPIs: null,
  }

  openGenres = (e) => {
    this.setState({ ...this.state, anchorGenres: e.currentTarget });
  }

  openSorts = (e) => {
    this.setState({ ...this.state, anchorSorts: e.currentTarget });
  }

  openAPIs = (e) => {
    this.setState({ ...this.state, anchorAPIs: e.currentTarget });
  }

  closeMenu = () => {
    this.setState({ anchorGenres: null, anchorSorts: null, anchorAPIs: null });
  }

  selectGenre = (genre) => {
    const { dispatch, search } = this.props

    this.closeMenu()
    if (genre === 'none')
      genre = ''
    if (genre !== search.genre)
      dispatch(fetchMovies({genre}))
  }

  selectSort = (sort) => {
    const { dispatch, search } = this.props

    this.closeMenu()
    if (sort === 'none')
      sort = ''
    if (sort !== search.sort)
      dispatch(fetchMovies({sort}))
  }

  selectAPI = (api) => {
    const { dispatch, search } = this.props

    this.closeMenu()
    if (api !== search.api)
      dispatch(fetchMovies({api}))
  }

  render() {
    const genres = ['none', 'action', 'adventure', 'animation', 'comedy', 'crime',
      'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror',
      'music', 'mystery', 'sports', 'romance', 'science-fiction', 'thriller',
      'war', 'western', 'biography', 'musical']
    const sorts = ['none', 'rating', 'year', 'title']
    const { anchorGenres, anchorSorts, anchorAPIs } = this.state
    const { locale } = this.props.locales
    const { search } = this.props
    return (
      <Grid container spacing={8}>
        <Grid item>
          <Button
            variant="outlined"
            color={search.genre ? 'primary' : 'default'}
            onClick={this.openGenres}
          >
             {search.genre ? locale.genres[search.genre] : 'Genre'}
          </Button>
          <Menu
            anchorEl={anchorGenres}
            open={Boolean(anchorGenres)}
            onClose={this.closeMenu}
          >
           {genres.map(genre => {
             return <MenuItem key={genre} onClick={() => this.selectGenre(genre)}>{locale.genres[genre]}</MenuItem>
           })}
          </Menu>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color={search.sort ? 'primary' : 'default'}
            onClick={this.openSorts}
          >
            {search.sort ? locale.sort[search.sort] : locale.sort.sort}
          </Button>
          <Menu
            anchorEl={anchorSorts}
            open={Boolean(anchorSorts)}
            onClose={this.closeMenu}
          >
           {sorts.map(sort => {
             return <MenuItem key={sort} onClick={() => this.selectSort(sort)}>{locale.sort[sort]}</MenuItem>
           })}
          </Menu>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.openAPIs}
          >
            {'API : ' + search.api}
          </Button>
          <Menu
            anchorEl={anchorAPIs}
            open={Boolean(anchorAPIs)}
            onClose={this.closeMenu}
          >
            <MenuItem onClick={() => this.selectAPI('yts')}>YTS</MenuItem>
            <MenuItem onClick={() => this.selectAPI('popcorntime')}>popcorntime</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => { return state }
let SortExport = Sort
SortExport = connect(mapStateToProps)(SortExport)

export default SortExport
