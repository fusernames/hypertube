import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link, Button, IconButton, Badge, Tooltip } from '@material-ui/core'
import { NotificationsTwoTone as NotificationsIcon } from '@material-ui/icons'
import { CancelTwoTone as CancelIcon } from '@material-ui/icons'
import { PersonTwoTone as PersonIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

class LoggedNav extends React.Component {

  handleLogout = () => {

  }

  render () {
    const { locale } = this.props.locales
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
          <IconButton color="inherit" onClick={this.handleLogout}>
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
