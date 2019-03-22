import React from 'react'
import { connect } from 'react-redux'
import Join from '../join/Join'

class Home extends React.Component {
  render() {
    const { auth } = this.props
    return (
      auth.logged ? null :  <Join />
    )
  }
}

const mapStateToProps = state => {
  return state
}

let HomeExport = connect(mapStateToProps)(Home)
export default HomeExport
