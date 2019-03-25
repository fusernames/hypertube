import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
import req from '../../utils/req'
import { withStyles } from '@material-ui/core/styles'
import { fetchMovies, fetchAddMovies } from '../../redux/search/actions'
import { Link } from 'react-router-dom'

class Search extends Component {

  _isMounted = false

  componentWillMount() {
    const { search, dispatch } = this.props
    if (search.movies.length === 0 && search.word === '')
      dispatch(fetchMovies())
  }

  componentDidMount() {
    const { search, dispatch } = this.props
    this._isMounted = true
    window.onscroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight * 0.85)
        dispatch(fetchAddMovies())
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { movies } = this.props.search
    const { classes } = this.props
    return (
      <Grid container spacing={8}>
        {movies.map(movie => {
          return (
            <Grid key={movie.id} item xs={6} sm={3} md={2}>
              <Link to={'/movie/' + movie.id} style={{textDecoration: 'none'}}>
                <div className={classes.movie}>
                  <img src={movie.image} alt={movie.title} width="100%" style={{textAlign:'center'}}/>
                </div>
              </Link>
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
    alignItems: 'center',
    '@global' : {
      'img' : {
        fontFamily: 'Roboto, Arial',
        color: 'rgba(255,255,255,0.9)',
      }
    }
  }
}
let SearchExport = Search
SearchExport = withStyles(styles)(SearchExport)
SearchExport = connect(mapStateToProps)(SearchExport)

export default SearchExport
