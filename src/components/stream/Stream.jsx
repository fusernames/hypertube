import React, { Component } from 'react'
import { connect } from 'react-redux'
import req from '../../utils/req'
import host from '../../config'
import Player from '../player/Player'
import Comments from '../comments/Comments';
import CommentsBox from '../comments/CommentsBox';

class Stream extends Component {

  state = {
    isFetching: false,
    startTime: null,
  }

  fetchStream = (id) => {
    this.setState({...this.state, isFetching: true})
    req(host + '/api/movie_statuses/' + id , {useToken: true})
    .then(res => {
        this.setState({
            isFetching: false,
            startTime: res.time
        })
    })
  }

  componentWillMount() {
    this.fetchStream(this.props.match.params.id)
  }

  render() {
    return (
      <div>
        <Player mediaUrl={"https://hypertube.barthonet.ovh/api/movies/file/" + this.props.match.params.id} startTime={0}/>
        <CommentsBox id={this.props.match.params.id} />
        <Comments id={this.props.match.params.id} />
      </div>
    );
  }
}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Stream)
