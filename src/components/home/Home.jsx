import React from 'react'
import { connect } from 'react-redux'

class Home extends React.Component {
  render() {
    console.log(this.props);
    return null;
  }
}

const mapStateToProps = state => {
  return state
}

let HomeExport = connect(mapStateToProps)(Home)
export default HomeExport
