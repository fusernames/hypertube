import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid, Button, Menu, MenuItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

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
    this.closeGenres()
    dispatch(fetchMovies({genre}))
  }

  render() {
    const genres = ['action', 'adventure', 'animation', 'comedy', 'crime', 'disaster',
      'documentary', 'drama', 'eastern', 'family', 'fan-film', 'fantasy', 'film-noir',
      'history', 'holiday', 'horror', 'indie', 'music', 'mystery', 'none', 'road',
      'romance', 'science-fiction', 'short', 'sporting-event', 'suspense', 'thriller',
      'tv-movie', 'war', 'western']
    const { anchorGenres } = this.state
    const { locale } = this.props.locales
    return (
      <div>
        <Button
           aria-owns={anchorGenres ? 'simple-menu' : undefined}
           aria-haspopup="true"
           onClick={this.openGenres}
         >
           Genres
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
