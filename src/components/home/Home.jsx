import React from 'react'
import { connect } from 'react-redux'

class Home extends React.Component {
  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return state
}

let HomeExport = connect(mapStateToProps)(Home)
export default HomeExport
