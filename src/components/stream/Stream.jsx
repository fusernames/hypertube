import React, { Component } from 'react'
import { connect } from 'react-redux'
import req from '../../utils/req'
import { Typography, Icon, IconButton } from '@material-ui/core'
import host from '../../config'
import Player from '../player/Player'
import Comments from '../comments/Comments'
import { alert } from '../../redux/snackbars/actions'

class Stream extends Component {

  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    isFetching: false,
    startTime: undefined,
    statusId: -1,
    name: ''
  }

  fetchStream = (id) => {
    const { dispatch } = this.props
    this.setStateCheck({
      ...this.state,
      isFetching: true
    })
    let userId = this.props.auth.user.id
    req(host + '/api/movie_statuses.json?movie.id=' + id + "&user.id=" + userId, {
      useToken: true
    }).then(res => {
      if (res.length === 1) {
        this.setStateCheck({
          isFetching: false,
          startTime: res[0].time,
          statusId: res[0].id,
          name: res[0].movie.name
        })
      } else {
        req(host + '/api/movie_statuses', {
          method: 'POST',
          body: {
            time: 0,
            user: '/api/users/' + userId,
            movie: '/api/movies/' + id
          },
          useToken: true
        }).then(res => {
          this.setStateCheck({
            isFetching: false,
            startTime: 0,
            statusId: res.id
          })
        }).catch(err => {
          if (err._status < 500) {
            dispatch(alert('AJAX_ERROR', 'error'))
          }
          this.setStateCheck({
            ...this.state,
            isFetching: false,
            startTime: 0
          })
        })
      }
    }).catch(() => {
      this.setStateCheck({
        ...this.state,
        isFetching: false,
        startTime: 0
      })
    })
  }

  updateMovieStatus = newTime => {
    const { statusId, isFetching } = this.state
    if (statusId === -1 || isFetching) return
    this.setStateCheck({
      ...this.state,
      isFetching: true
    })
    req(host + '/api/movie_statuses/' + statusId, {
      method: 'PUT',
      body: {
        time: parseInt(newTime)
      },
      useToken: true
    }).then(() => {
      this.setStateCheck({
        ...this.state,
        isFetching: false
      })
    }).catch(err => {
      this.setStateCheck({
        ...this.state,
        isFetching: false
      })
    })
  }

  fetchSubtitles = id => {
    req(host + '/api/movies/subtitles/' + id)
    .catch(ignored => {})
  }

  fetchMovie = id => {
    const { dispatch } = this.props
    req(host + '/api/movies/' + id, { useToken: true })
    .then(() => {
      this.fetchStream(id)
      this.fetchSubtitles(id)
    }).catch(err => {
      if (err._status < 500) {
        dispatch(alert('MOVIE_NOT_FOUND', 'error'))
      }
    })
  }

  componentWillMount() {
    this._isMounted = true
    const { params } = this.props.match;
    this.fetchMovie(params.id)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  navigateBack = () => {
    this.goBack();
  }

  render() {
    const { startTime, name } = this.state
    const { params } = this.props.match
    if (startTime === undefined) return null
    return (
      <div>
        <div style={{display: 'flex', alignItems:'center', marginBottom:'8px' }}>
          <IconButton style={{marginRight:'5px'}} onClick={() => this.props.history.goBack()} >
            <Icon color="primary">keyboard_arrow_left</Icon>
          </IconButton>
          <Typography variant="h5" inline>{name}</Typography>
        </div>
        <Player mediaUrl={host + "/api/movies/file/" + params.id}
            startTime={startTime}
            onChange={this.updateMovieStatus}
            movieId={params.id}
            />
        <Comments id={params.id} />
      </div>
    );
  }
}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Stream)
