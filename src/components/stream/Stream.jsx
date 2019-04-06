import React, { Component } from 'react'
import { connect } from 'react-redux'
import req from '../../utils/req'
import { Typography} from '@material-ui/core'
import host from '../../config'
import Player from '../player/Player'
import Comments from '../comments/Comments';

class Stream extends Component {

  state = {
    isFetching: false,
    startTime: undefined,
    statusId: -1,
    name: ''
  }

  fetchStream = (id) => {
    this.setState({
      ...this.state,
      isFetching: true
    })
    let userId = this.props.auth.user.id
    req(host + '/api/movie_statuses.json?movie.id=' + id + "&user.id=" + userId, {
      useToken: true
    }).then(res => {
      if (res.length === 1) {
        this.setState({
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
          this.setState({
            isFetching: false,
            startTime: 0,
            statusId: res.id
          })
        }).catch(err => {
          // Handle error
          this.setState({
            ...this.state,
            isFetching: false,
            startTime: 0
          })
        })
      }
      console.log(res)
    }).catch(err => {
      // Handle error
      this.setState({
        ...this.state,
        isFetching: false,
        startTime: 0
      })
    })
  }

  updateMovieStatus = newTime => {
    const { statusId, isFetching } = this.state
    if (statusId === -1 || isFetching) return
    this.setState({
      ...this.state,
      isFetching: true
    })
    req(host + '/api/movie_statuses/' + statusId, {
      method: 'PUT',
      body: {
        time: parseInt(newTime)
      },
      useToken: true
    }).then(res => {
      this.setState({
        ...this.state,
        isFetching: false
      })
    }).catch(err => {
      // Handle error
      this.setState({
        ...this.state,
        isFetching: false
      })
    })
  }

  fetchSubtitles = id => {
    req(host + '/api/movies/subtitles/' + id)
    .catch(err => {
      // Handle error
    })
  }

  componentWillMount() {
    const { params } = this.props.match;
    this.fetchStream(params.id)
    this.fetchSubtitles(params.id)
  }

  render() {
    const { startTime } = this.state
    const { params } = this.props.match
    if (startTime === undefined) return null
    return (
      <div>
        <Typography variant="h5" style={{marginBottom:'15px'}}>{this.state.name}</Typography>
        <Player mediaUrl={"https://hypertube.barthonet.ovh/api/movies/file/" + params.id}
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
