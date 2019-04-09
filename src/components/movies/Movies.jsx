import React, { Component } from 'react'
import { connect } from 'react-redux'
import req from '../../utils/req'
import { Icon, IconButton, ListItem, ListItemText, ListItemSecondaryAction, List, ListItemAvatar, Avatar } from '@material-ui/core'
import host from '../../config'
import { Link } from 'react-router-dom'
import { blue } from '@material-ui/core/colors'

class Movies extends Component {

  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    movies: []
  }

  fetchMovies = () => {
    const { auth } = this.props
    req(host + '/api/movie_statuses.json?&user.id=' + auth.user.id, {
      useToken: true
    }).then(res => {
      console.log(res)
      this.setStateCheck({
        ...this.state,
        movies: res
      })
    })
  }

  componentWillMount() {
    this._isMounted = true
    this.fetchMovies()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { movies } = this.state
    return (
      <div>
        <List>
          {movies.map((movie, i) => {
            return (
              <ListItem divider key={movie.id}>
                <ListItemAvatar>
                  <Avatar style={{backgroundColor: blue[400], color: '#fff'}}>
                    <Icon>local_movies</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={movie.movie.name}
                  secondary={Math.round(movie.time / 60) + ' min'}
                />
                <ListItemSecondaryAction>
                  <IconButton color="primary" component={Link} to={"/stream/" + movie.movie.id}>
                    <Icon>play_circle_outline</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </div>
    )
  }

}

export default connect(state => state)(Movies)
