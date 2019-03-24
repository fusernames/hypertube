import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
import req from '../../utils/req'
import { withStyles } from '@material-ui/core/styles'
import { fetchMovies, fetchAddMovies } from '../../redux/search/actions'

class Search extends Component {

  componentWillMount() {
    this.props.dispatch(fetchMovies())
  }

  componentDidMount() {
    const { search, dispatch } = this.props
    window.onscroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 50)
        dispatch(fetchAddMovies())
    }
  }

  render() {
    const { movies } = this.props.search
    const { classes } = this.props
    return (
      <Grid container spacing={8}>
        {movies.map(movie => {
          if (!movie.images || !movie.images.banner) return null
          return (
            <Grid key={movie._id} item xs={6} sm={3} md={2}>
              <div className={classes.movie}>
                <img src={movie.images.banner} width="100%"/>
              </div>
            </Grid>
          )
        })}
      </Grid>
    )
  }
}

const mapStateToProps = state => { return state }
const styles = {
  movie: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  }
}
let SearchExport = Search
SearchExport = withStyles(styles)(SearchExport)
SearchExport = connect(mapStateToProps)(SearchExport)

export default SearchExport
