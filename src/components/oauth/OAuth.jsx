import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import Loading from '../../utils/jsx/Loading'
import req from '../../utils/req'
import host from '../../config'

class OAuth extends React.Component {

  componentDidMount() {
    const { name } = this.props.match.params;
    let token = "";
    switch (name) {
      case "github":
      case "42":
        token = this.props.location.query.code;
        break;
      case "facebook":
        // Handle
        break;
      case "twitter":
        // Handle
        break;
      case "gmail":
        // Handle
        break;
    }
    if (token != undefined) {
      req(host + "/api/oauth", {
      method: "POST",
      body: {
        api: name,
        token: token
      }
      }).then(res => {
        // Handle api response
      }).catch(err => {
        // Handle errors
      })
    } else {
      window.location = host;
    }
  }

  render() {
    const { auth } = this.props
    return (
      auth.logged ? <Redirect to={{pathname: '/', state: {from: this.props.location}}} /> :  <Loading />
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(OAuth)
