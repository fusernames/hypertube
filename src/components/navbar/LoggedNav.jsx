import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link, Button, IconButton, Badge, Tooltip } from '@material-ui/core'
import { NotificationsTwoTone as NotificationsIcon } from '@material-ui/icons'
import { CancelTwoTone as CancelIcon } from '@material-ui/icons'
import { PersonTwoTone as PersonIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../../redux/auth/actions'

class LoggedNav extends React.Component {

  render () {
    const { locale } = this.props.locales
    const { dispatch } = this.props;
    return (
      <div>
        <Tooltip title={locale.navbar.notifications} placement="bottom">
          <IconButton color="inherit">
            <Badge badgeContent={17} color="secondary">
              <NotificationsIcon/>
            </Badge>
          </IconButton>
        </Tooltip>
        <IconButton color="inherit">
          <PersonIcon/>
        </IconButton>
        <Tooltip title={locale.navbar.logout} placement="bottom">
          <IconButton color="inherit" onClick={() => { dispatch(logout()) }}>
            <CancelIcon/>
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

const styles = {
}
function mapStateToProps(state) {
  return state
}
let LoggedNavExport = LoggedNav
LoggedNavExport = withStyles(styles)(LoggedNavExport)
LoggedNavExport = connect(mapStateToProps)(LoggedNavExport)

export default LoggedNavExport
