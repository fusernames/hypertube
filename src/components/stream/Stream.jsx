import React, { Component } from 'react'
import { connect } from 'react-redux'
import req from '../../utils/req'
import host from '../../config'
import Player from '../player/Player'
import Comments from '../comments/Comments';

class Stream extends Component {

  state = {
    isFetching: false,
    startTime: null,
  }

  fetchStream = (id) => {
    this.setState({
      ...this.state,
      isFetching: true
    })
    req(host + '/api/movie_statuses.json?movie.id=' + id + "&user.id=1", {
      useToken: true
    }).then(res => {
      this.setState({
        isFetching: false,
        startTime: res.time
      })
    }).catch(err => {
      // Handle error
      this.setState({
        isFetching: false,
        startTime: 0
      })
    })
  }

  componentWillMount() {
    this.fetchStream(this.props.match.params.id)
  }

  render() {
    const { startTime } = this.state;
    const { params } = this.props.match;
    return (
      <div>
        <Player mediaUrl={"https://hypertube.barthonet.ovh/api/movies/file/" + params.id} startTime={startTime}/>
        <Comments id={params.id} />
      </div>
    );
  }
}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Stream)
