import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import queryString from 'query-string'
import Loading from '../../utils/jsx/Loading'
import req from '../../utils/req'
import host from '../../config'
import Cookies from 'js-cookie'
import { getCurrentUser } from '../../redux/auth/actions'
import { alert } from '../../redux/snackbars/actions'

class OAuth extends React.Component {

  state = {
    component: <Loading />
  }

  componentDidMount() {
    const { name } = this.props.match.params
    const { dispatch } = this.props
    let token = ""
    let auth = {}

    switch (name) {
      case "gmail":
      case "42":
      case "github":
        token = queryString.parse(this.props.location.search).code;
        break
      case "trello":
        token = queryString.parse(this.props.location.hash.replace("#", "")).token
        break
      case "facebook":
        token = queryString.parse(this.props.location.hash.replace("#", "")).access_token
        break
      default:
        break
    }
    if (token !== undefined && token !== null) {
      req(host + "/api/users/oauth", {
        method: "POST",
        body: {
          api: name,
          token: token
        }
      }).then(res => {
        auth.token = res.token
        Cookies.set('jwt', auth.token)
        this.props.dispatch(getCurrentUser())
        this.setState({
          component: <Redirect to={{pathname: '/', state: {from: this.props.location}}} />
        });
      }).catch(err => {
        if (err._status === 403)
          dispatch(alert('OAUTH_ERROR', 'error'))
      })
    } else {
      window.location = host
    }
  }

  render() {
    const { auth } = this.props
    return (
      auth.logged ? <Redirect to={{pathname: '/', state: {from: this.props.location}}} /> : this.state.component
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(OAuth)
