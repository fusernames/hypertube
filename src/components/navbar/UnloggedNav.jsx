import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link, Button } from '@material-ui/core'
import { connect } from 'react-redux'

function UnloggedNav(props) {
  const { locale } = props.locales

  return (
    <React.Fragment>
      <Link component={RouterLink} to="/register" color="textPrimary">
        <Button color="inherit">{locale.navbar.register}</Button>
      </Link>
      <Link component={RouterLink} to="/login" color="textPrimary">
        <Button color="inherit">{locale.navbar.login}</Button>
      </Link>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return state
}

let UnloggedNavExport = connect(mapStateToProps)(UnloggedNav)
export default UnloggedNavExport
