import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid, Button, Menu, MenuItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { fetchMovies, fetchAddMovies } from '../../redux/search/actions'

class Sort extends Component {

  state = {
    anchorGenres: null,
    anchorSorts: null
  }

  openGenres = (e) => {
    this.setState({ anchorGenres: e.currentTarget });
  }

  openSorts = (e) => {
    this.setState({ anchorSorts: e.currentTarget });
  }

  closeGenres = () => {
    this.setState({ anchorGenres: null });
  }

  closeSorts = () => {
    this.setState({ anchorSorts: null });
  }

  selectGenre = (genre) => {
    const { dispatch, search } = this.props

    this.closeGenres()
    if (genre === 'none')
      genre = ''
    if (genre !== search.genre)
      dispatch(fetchMovies({genre}))
  }

  selectSort = (sort) => {
    const { dispatch, search } = this.props

    this.closeSorts()
    if (sort === 'none')
      sort = ''
    if (sort !== search.sort)
      dispatch(fetchMovies({sort}))
  }

  render() {
    const genres = ['none', 'action', 'adventure', 'animation', 'comedy', 'crime',
      'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror',
      'music', 'mystery', 'sports', 'romance', 'science-fiction', 'thriller',
      'war', 'western', 'biography', 'musical']
    const sorts = ['none', 'rating', 'year', 'title']
    const { anchorGenres, anchorSorts } = this.state
    const { locale } = this.props.locales
    const { search } = this.props
    return (
      <div>
        <Button
           color={search.genre ? 'primary' : 'textPrimary'}
           onClick={this.openGenres}
         >
           {search.genre ? locale.genres[search.genre] : 'Genre'}
        </Button>
        <Menu
          anchorEl={anchorGenres}
          open={Boolean(anchorGenres)}
          onClose={this.closeGenres}
        >
         {genres.map(genre => {
           return <MenuItem key={genre} onClick={() => this.selectGenre(genre)}>{locale.genres[genre]}</MenuItem>
         })}
        </Menu>
        <Button
          color={search.sort ? 'primary' : 'textPrimary'}
          onClick={this.openSorts}
        >
          {search.sort ? locale.sort[search.sort] : locale.sort.sort}
        </Button>
        <Menu
          anchorEl={anchorSorts}
          open={Boolean(anchorSorts)}
          onClose={this.closeSorts}
        >
         {sorts.map(sort => {
           return <MenuItem key={sort} onClick={() => this.selectSort(sort)}>{locale.sort[sort]}</MenuItem>
         })}
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = state => { return state }
let SortExport = Sort
SortExport = connect(mapStateToProps)(SortExport)

export default SortExport
