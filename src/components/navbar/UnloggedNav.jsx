import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link, Button } from '@material-ui/core'

function UnloggedNav() {
  return (
    <React.Fragment>
      <Link component={RouterLink} to="/register" color="textPrimary">
        <Button color="inherit">Register</Button>
      </Link>
      <Link component={RouterLink} to="/login" color="textPrimary">
        <Button color="inherit">Login</Button>
      </Link>
    </React.Fragment>
  )
}

export default UnloggedNav
