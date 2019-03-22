import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link, Button, IconButton, Badge, Tooltip, Menu, MenuItem } from '@material-ui/core'
import { NotificationsTwoTone as NotificationsIcon } from '@material-ui/icons'
import { CancelTwoTone as CancelIcon } from '@material-ui/icons'
import { PersonTwoTone as PersonIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../../redux/auth/actions'

class LoggedNav extends React.Component {

  state = {
    anchorEl: null,
  }

  openSubMenu = e => {
    console.log(e.currentTarget)
    this.setState({ anchorEl: e.currentTarget })
  }

  closeSubMenu = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const { locale } = this.props.locales
    const { dispatch } = this.props
    const { anchorEl } = this.state
    const isMenuOpen = Boolean(anchorEl)
    const SubMenu = () => {
      let i = 0;
      return (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={this.closeSubMenu}
        >
          <MenuItem onClick={this.closeSubMenu}>{locale.navbar.profile}</MenuItem>
          <MenuItem onClick={this.closeSubMenu}>{locale.navbar.my_account}</MenuItem>
        </Menu>
      )
    }

    return (
      <div>
        <Tooltip title={locale.navbar.notifications} placement="bottom">
          <IconButton color="inherit">
            <Badge badgeContent={17} color="secondary">
              <NotificationsIcon/>
            </Badge>
          </IconButton>
        </Tooltip>
        <IconButton
          color="inherit"
          onClick={this.openSubMenu}
        >
          <PersonIcon/>
        </IconButton>
        <SubMenu />
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
