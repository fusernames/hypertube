import React from 'react'
import { connect } from 'react-redux'
import Join from '../join/Join'
import Search from '../search/Search'

class Home extends React.Component {
  render() {
    const { auth } = this.props
    return (
      auth.logged ? <Search /> :  <Join />
    )
  }
}

const mapStateToProps = state => {
  return state
}

let HomeExport = connect(mapStateToProps)(Home)
export default HomeExport
