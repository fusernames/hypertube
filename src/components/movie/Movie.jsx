import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon';
import Loading from '../../utils/jsx/Loading'
import req from '../../utils/req'
import host from '../../config'
import { browserHistory } from 'react-router'
import Torrents from './Torrents'

class Movie extends React.Component {


  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    movie: {
      genres: [],
      torrents: []
    },
    viewed: false,
    isFetching: false
  }

  parseYtLink(link) {
    if (link) {
      let res = link.split('?v=')
      if (res[1])
        res = res[1]
      return 'https://www.youtube.com/embed/' + res
    }
  }

  pad = nbr => {
    return nbr > 0 && nbr < 10 ? '0' + nbr : nbr;
  }

  parseTorrents = torrents => {
    let ret = []
    for (let k in torrents) {
      ret.push(torrents[k])
      ret[ret.length - 1].quality = k
      ret[ret.length - 1].size = torrents[k].filesize
      ret[ret.length - 1].magnet = torrents[k].url
    }
    return ret
  }

  fetchMovie = (id) => {
    if (id[0] === 't') {
      this.setStateCheck({...this.state, isFetching: true})
      req('https://tv-v2.api-fetch.website/movie/' + id)
      .then(res => {
        this.setStateCheck({
          isFetching: false,
          movie: {
            image: res.images.poster,
            title: res.title,
            synopsis: res.synopsis,
            genres: res.genres,
            year: res.year,
            rating: res.rating.percentage / 10,
            time: parseInt(res.runtime / 60) + 'h' + this.pad(res.runtime % 60),
            trailer: this.parseYtLink(res.trailer),
            torrents: this.parseTorrents(res.torrents.en)
          }
        })
      })
    } else {
      this.setStateCheck({...this.state, isFetching: true})
      req('https://yts.am/api/v2/movie_details.json?movie_id=' + id)
      .then(res => {
        res = res.data.movie
        this.setStateCheck({
          isFetching: false,
          movie: {
            isFetching: false,
            image: res.large_cover_image,
            title: res.title,
            synopsis: res.description_intro,
            genres: res.genres,
            year: res.year,
            rating: res.rating,
            time: parseInt(res.runtime / 60) + 'h' + this.pad(res.runtime % 60),
            trailer: this.parseYtLink(res.yt_trailer_code),
            torrents: res.torrents.reverse()
          }
        })
      })
    }
  }

  getViewed = (id) => {
    this.setStateCheck({...this.state, isFetching: true})
    req(host + '/api/movie_statuses.json?movie.id=' + id + "&user.id=" + this.props.auth.user.id, {useToken: true})
    .then(res => {
      console.log(res)
      let viewed = ((res[0] && res[0].time > 0) ? true : false)
      this.setStateCheck({
        ...this.state,
        viewed: viewed,
        isFetching: false
      })
    })
  }

  componentWillMount() {
    this._isMounted = true
    const id = this.props.match.params.id
    this.fetchMovie(id)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  navigateBack = () => {
    this.goBack();
  }

  render() {
    const { movie, isFetching, viewed } = this.state
    const { classes } = this.props
    const { locale } = this.props.locales
    console.log(viewed)

    if (!movie.title) return null
    return (
      <div>
        <Loading display={isFetching}/>
        <Icon onClick={() => this.props.history.goBack()}
         color="primary" style={{position:'absolute', top:'80px', left:'40px'}}>keyboard_arrow_left</Icon>
        <Typography variant="h5" style={{marginBottom:'15px'}}>{movie.title}</Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={5} md={5} style={{position:'relative'}}>
            {viewed && <Icon color="primary" style={{position:'absolute', top:'15px', left:'15px'}}>visibility</Icon>}
            <img className={classes.img} src={movie.image} alt={movie.title} width="100%"/>
          </Grid>
          <Grid item xs={12} sm={7} md={7}>
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>star</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.rating}</Typography>
                  <Typography color="textPrimary">{movie.rating + '/10'}</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>movie_creation</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.production}</Typography>
                  <Typography color="textPrimary">{movie.year}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>format_align_left</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.synopsis}</Typography>
                  <Typography color="textPrimary">{movie.synopsis}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>timer</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.time}</Typography>
                  <Typography color="textPrimary">{movie.time}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>local_movies</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.genres}</Typography>
                  {movie.genres.map(genre => {
                    return <Typography color="textPrimary" key={genre}>
                      {locale.genres[genre.toLowerCase()]}
                    </Typography>
                  })}
                </div>
              </Grid>
              {movie.trailer &&
                <Grid item xs={12}>
                  <div className={classes.paper}>
                    <Icon color="primary" style={{float:'right'}}>play_circle_outline</Icon>
                    <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.trailer}</Typography>
                    <iframe title="yt" id="ytplayer" type="text/html" src={movie.trailer} frameBorder="0" className={classes.frame} allowFullScreen="1"/>
                  </div>
                </Grid>
              }
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Torrents torrents={movie.torrents} onChange={this.getViewed}/>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = theme => ({
  img: {
    borderRadius:'5px',
    overflow:'hidden'
  },
  paper: {
    background: theme.palette.secondary.dark,
    height:'100%',
    borderRadius: '5px',
    padding:'15px 20px',
    overflow:'hidden'
  },
  frame: {
    margin: '0 -20px -19px -20px',
    width: 'calc(100% + 40px)',
    height: '20vw',
    minHeight: '250px'
  }
})
const mapStateToProps = state => { return state }
let MovieExport = Movie
MovieExport = withStyles(styles)(MovieExport)
MovieExport = connect(mapStateToProps)(MovieExport)
export default MovieExport
