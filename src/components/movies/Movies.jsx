import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, IconButton, ListItem, ListItemText, ListItemSecondaryAction, List, ListItemAvatar, Avatar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { blue } from '@material-ui/core/colors'
import { fetchMyMovies } from '../../redux/search/actions'

class Movies extends Component {

  _isMounted = false

  componentWillMount() {
    const { dispatch } = this.props
    this._isMounted = true
    dispatch(fetchMyMovies())
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { myMovies } = this.props.search
    return (
      <div>
        <IconButton style={{marginRight:'5px'}} onClick={() => this.props.history.goBack()} >
          <Icon color="primary">keyboard_arrow_left</Icon>
        </IconButton>
        <List>
          {myMovies.map((movie, i) => {
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
