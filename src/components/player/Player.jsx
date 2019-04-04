import React, { Component } from 'react'
import { connect } from 'react-redux'

/**
 * Component takes 2 props =>
 *    onChange -> Method called to update video time in db.
 *    startTime -> Time in seconds where the video should start.
 *    mediaUrl -> Link of the video to read.
 *    subtitles -> video subtitles yea
 */
class Player extends Component {

  state = {
    oldTime: 0,
    currentTime: 0
  }

  enableEvent = false
  player = null

  componentDidMount = () => {
    let { startTime } = this.props;
    this.player = document.getElementById("player");
    if (this.player.currentTime < startTime)
      this.player.currentTime = startTime;
    document.addEventListener('keydown', this.handleKeyPress)
  }

  handleTimeChange = e => {
    this.setState({
      currentTime: e.target.currentTime,
    }, () => {
      let { currentTime, oldTime } = this.state;
      if (Math.abs(currentTime - oldTime) > 5 && this.props.onChange) {
        this.setState({ oldTime: currentTime });
        this.props.onChange(currentTime);
      }
    })
  }

  handleKeyPress = e => {
    const { player } = this
    if (!this.enableEvent || !this.player) return;
    let needsPrevent = true
    switch (e.key) {
      case " ":
        player.paused ? player.play() : player.pause()
        e.preventDefault()
        break
      case "ArrowRight":
        player.currentTime += 10
        break
      case "ArrowLeft":
        player.currentTime -= 10
        break
      case "ArrowUp":
        player.volume > .9 ? player.volume = 1 : player.volume += .1
        break
      case "ArrowDown":
        player.volume < .1 ? player.volume = 0 : player.volume -= .1
        break
      default:
        needsPrevent = false
    }
    if (needsPrevent) e.preventDefault()
  }

  render() {
    const { mediaUrl, subtitles } = this.props
    if (!mediaUrl) return null
    return (
      <video id="player" controls
          onTimeUpdate={this.handleTimeChange}
          onMouseEnter={() => this.enableEvent = true}
          onMouseLeave={() => this.enableEvent = false}>
        <source src={mediaUrl} />
        {subtitles.eng !== undefined && <track label="English" kind="subtitles" srcLang="en" src={subtitles.eng} />}
      </video>
    );
  }

}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Player)
