import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link, Button, IconButton, Badge, Tooltip, Menu, MenuItem, Paper, Popper, Typography } from '@material-ui/core'
import { Notifications as NotificationsIcon } from '@material-ui/icons'
import { Cancel as CancelIcon } from '@material-ui/icons'
import { Person as PersonIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../../redux/auth/actions'
import Notifications from './Notifications'

class LoggedNav extends React.Component {

  state = {
    anchorSubMenu: null,
    anchorPopper: null,
    openPopper: false
  }

  togglePopper = e => {
    this.setState({
      anchorPopper: e.currentTarget,
      openPopper: !this.state.openPopper
    })
  }

  openSubMenu = e => {
    console.log(e.currentTarget)
    this.setState({ anchorSubMenu: e.currentTarget })
  }

  closeSubMenu = () => {
    this.setState({ anchorSubMenu: null })
  }

  render () {
    const { locale } = this.props.locales
    const { dispatch } = this.props
    const { anchorSubMenu, anchorPopper, openPopper } = this.state
    const isMenuOpen = Boolean(anchorSubMenu)
    const SubMenu = () => {
      let i = 0;
      return (
        <Menu
          anchorEl={anchorSubMenu}
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
        <IconButton color="primary" onClick={this.togglePopper}>
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon/>
          </Badge>
        </IconButton>
        <Popper id={''} open={openPopper} anchorEl={anchorPopper}>
          <Paper style={{padding: '22px 10px 10px 10px'}}>
            <Typography>Notifs here</Typography>
          </Paper>
        </Popper>
        <IconButton color="primary" onClick={this.openSubMenu}>
          <PersonIcon/>
        </IconButton>
        <SubMenu />
        <Notifications />
        <Tooltip title={locale.navbar.logout} placement="bottom">
          <IconButton color="primary" onClick={() => { dispatch(logout()) }}>
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
