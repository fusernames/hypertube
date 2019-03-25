import React from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon';

class Movie extends React.Component {

  state = {
    movie: {
      genres: []
    }
  }

  parseYtLink(link) {
    let res = link.split('?v=')
    if (res[1])
      res = res[1]
    return 'https://www.youtube.com/embed/' + res
  }

  fetchMovie = (id) => {
    if (id[0] == 't') {
      fetch('https://tv-v2.api-fetch.website/movie/' + id)
      .then(res => res.json())
      .then(json => {
        this.setState({movie: {
          image: json.images.poster,
          title: json.title,
          synopsis: json.synopsis,
          genres: json.genres,
          year: json.year,
          time: json.runtime,
          trailer: this.parseYtLink(json.trailer)
        }})
        console.log(json)
      })
    } else {
      fetch('https://yts.am/api/v2/movie_details.json?movie_id=' + id)
      .then(res => res.json())
      .then(json => {
        json = json.data.movie
        this.setState({movie: {
          image: json.large_cover_image,
          title: json.title,
          synopsis: json.description_intro,
          genres: json.genres,
          year: json.year,
          time: json.runtime,
          trailer: this.parseYtLink(json.yt_trailer_code)
        }})
        console.log(json)
      })
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id
    this.fetchMovie(id)
  }

  render() {
    const { movie } = this.state
    const { classes } = this.props
    const { locale } = this.props.locales
    return (
      <div>
        <Typography variant="h5" color="primary" style={{marginBottom:'15px'}}>{movie.title}</Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} md={5} lg={5}>
            <img className={classes.img} src={movie.image} width="100%"/>
          </Grid>
          <Grid item xs={12} sm={6} md={7} lg={7}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>format_align_left</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.synopsis}</Typography>
                  <Typography variant="caption" color="textPrimary">{movie.synopsis}</Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>movie_creation</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.production}</Typography>
                  <Typography variant="caption" color="textPrimary">{movie.year}</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>timer</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.time}</Typography>
                  <Typography variant="caption" color="textPrimary">{movie.time}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>local_movies</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.genres}</Typography>
                  <Typography variant="caption" color="textPrimary">
                    {movie.genres.map(gender => {
                      return <div key={gender}>{gender}</div>
                    })}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>play_arrow</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.trailer}</Typography>
                  <iframe id="ytplayer" type="text/html" src={movie.trailer} frameBorder="0" className={classes.frame} allowFullScreen="1"/>
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
    padding:'15px 20px'
  },
  frame: {
    margin: '0 -20px',
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
