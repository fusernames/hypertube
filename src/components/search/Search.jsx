import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
import Loading from '../../utils/jsx/Loading'
import { withStyles } from '@material-ui/core/styles'
import { fetchMovies, fetchAddMovies } from '../../redux/search/actions'
import { Link } from 'react-router-dom'
import Sort from './Sort'

class Search extends Component {

  _isMounted = false

  componentWillMount() {
    const { search, dispatch } = this.props
    if (search.movies.length === 0 && search.word === '')
      dispatch(fetchMovies())
  }

  componentDidMount() {
    const { dispatch } = this.props
    this._isMounted = true
    window.onscroll = () => {
      if (this._isMounted === true) {
        if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 200)
          dispatch(fetchAddMovies())
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  showInformations = (id) => {
    document.getElementById(id).style.display = 'block'
  }

  hideInformations = (id) => {
    document.getElementById(id).style.display = 'none'
  }

  render() {
    const { movies, isFetching } = this.props.search
    const { classes } = this.props
    const { locale } = this.props.locales
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Sort />
        </Grid>
        <Grid item xs={12}>
          {movies.length === 0 && !isFetching && <Typography align="center">{locale.search.no_results}</Typography>}
          <Grid container spacing={8}>
            {movies.map(movie => {
              return (
                <Grid key={movie.id} item xs={6} sm={3} md={2}>
                  <Link to={'/movie/' + movie.id} style={{textDecoration: 'none'}}>
                    <div className={classes.movie}
                      onMouseEnter={() => this.showInformations(movie.id)}
                      onMouseLeave={() => this.hideInformations(movie.id)}
                    >
                      <img src={movie.image} alt={movie.title} width="100%" style={{textAlign:'center'}}/>
                      <div id={movie.id} className={classes.informations}>
                        <Typography variant="button">{movie.title}</Typography>
                        <Typography variant="caption">{locale.movie.production + ': ' + movie.year}</Typography>
                        <Typography variant="caption">{locale.movie.rating + ': ' + movie.rating}</Typography>
                      </div>
                    </div>
                  </Link>
                </Grid>
              )
            })}
          </Grid>
          <Loading display={isFetching}/>
        </Grid>
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
    position: 'relative',
    alignItems: 'center',
    '@global' : {
      'img' : {
        fontFamily: 'Roboto, Arial',
        color: 'rgba(255,255,255,0.9)',
      }
    }
  },
  informations: {
    position: 'absolute',
    bottom: '0px',
    display:'none',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.7))',
    width:'100%',
    padding:'10px',
    wordBreak: 'break-word'
  },
  progress: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center'
  }
}
let SearchExport = Search
SearchExport = withStyles(styles)(SearchExport)
SearchExport = connect(mapStateToProps)(SearchExport)

export default SearchExport
