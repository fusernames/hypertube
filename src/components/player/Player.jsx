import React, { Component } from 'react'
import { connect } from 'react-redux'

/**
 * Component takes 2 props =>
 *    onChange -> Method called to update video time in db.
 *    startTime -> Time in seconds where the video should start.
 *    mediaUrl -> Link of the video to read.
 */
class Player extends Component {

  state = {
    oldTime: 0,
    currentTime: 0
  }

  componentDidMount = () => {
    let { startTime } = this.props;
    let player = document.getElementById("player");
    if (player.currentTime < startTime)
      player.currentTime = startTime;
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

  render() {
    if (!this.props.mediaUrl) return null;
    return (
      <video id="player" controls onTimeUpdate={this.handleTimeChange}>
        <source src={this.props.mediaUrl} />
      </video>
    );
  }

}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Player)
