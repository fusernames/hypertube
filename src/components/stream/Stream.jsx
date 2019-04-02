import React, { Component } from 'react'
import { connect } from 'react-redux'
import Player from '../player/Player'

class Stream extends Component {

  render() {
    return (
      <div>
        <Player mediaUrl={"https://hypertube.barthonet.ovh/api/movies/file/" + this.props.match.params.id} startTime={0}/>
      </div>
    );
  }
}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Stream)
