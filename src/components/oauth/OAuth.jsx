import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

class OAuth extends React.Component {

  componentDidMount() {
    const { name } = this.props.match.params;

  }

  render() {
    const { auth } = this.props
    return (
      auth.logged ? <Redirect to={{pathname: '/', state: {from: this.props.location}}} /> :  null
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(OAuth)
