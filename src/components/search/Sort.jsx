import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid, Button, Menu, MenuItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { fetchMovies, fetchAddMovies } from '../../redux/search/actions'

class Sort extends Component {

  state = {
    anchorGenres: null
  }

  openGenres = (e) => {
    this.setState({ anchorGenres: e.currentTarget });
  }

  closeGenres = () => {
    this.setState({ anchorGenres: null });
  }

  selectGenre = (genre) => {
    const { dispatch, search } = this.props
    this.closeGenres()
    if (genre === 'none')
      genre = ''
    if (genre !== search.genre)
      dispatch(fetchMovies({genre}))
  }

  render() {
    const genres = ['none', 'action', 'adventure', 'animation', 'comedy', 'crime',
      'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror',
      'music', 'mystery', 'sports', 'romance', 'science-fiction', 'thriller',
      'war', 'western', 'biography', 'musical']
    const { anchorGenres } = this.state
    const { locale } = this.props.locales
    const { search } = this.props
    return (
      <div>
        <Button
           aria-owns={anchorGenres ? 'simple-menu' : undefined}
           aria-haspopup="true"
           onClick={this.openGenres}
         >
           {search.genre ? locale.genres[search.genre] : 'Genres'}
         </Button>
         <Menu
           id="simple-menu"
           anchorEl={anchorGenres}
           open={Boolean(anchorGenres)}
           onClose={this.closeGenres}
         >
           {genres.map(genre => {
             return <MenuItem key={genre} onClick={() => this.selectGenre(genre)}>{locale.genres[genre]}</MenuItem>
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
