import React, { Component } from 'react'
import { connect } from 'react-redux'
import host from '../../config'
import ReactPlayer from 'react-player';

/**
 * Component takes 2 props =>
 *    onChange -> Method called to update video time in db.
 *    startTime -> Time in seconds where the video should start.
 *    mediaUrl -> Link of the video to read.
 *    movieId -> ID of the movie reading, in order to set subtitles.
 */
class Player extends Component {

  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    oldTime: 0,
    currentTime: 0,
  }

  handleTimeChange = e => {
    this.setStateCheck({
      currentTime: e.playedSeconds,
    }, () => {
      let { currentTime, oldTime } = this.state;
      if (Math.abs(currentTime - oldTime) > 5 && this.props.onChange) {
        this.setStateCheck({ oldTime: currentTime });
        this.props.onChange(currentTime);
      }
    })
  }

  componentWillMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { mediaUrl, movieId, locales, startTime } = this.props
    const { currentTime } = this.state
    if (!mediaUrl) return null
    return (
      <div id="player">
        <ReactPlayer
          ref="reactPlayer"
          controls={true}
          width='100%'
          url={mediaUrl}
          onProgress={this.handleTimeChange}
          config={{
            file: {
              tracks: [
                {kind: 'subtitles', src: host + '/api/movies/subtitles/' + movieId + '/eng', srcLang: 'en', label: 'English'},
                {kind: 'subtitles', src: host + '/api/movies/subtitles/' + movieId + '/fre', srcLang: 'fr', label: 'Français', default: locales.code === "fr"}
              ]
            }
          }}
        />
        {this.refs.reactPlayer && startTime > currentTime ? this.refs.reactPlayer.seekTo(startTime, 'seconds') : ''}
      </div>
    );
  }

}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Player)
