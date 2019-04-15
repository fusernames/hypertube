import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { IconButton, Tooltip, Menu, MenuItem, Icon } from '@material-ui/core'
import { Cancel as CancelIcon } from '@material-ui/icons'
import { Person as PersonIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../../redux/auth/actions'

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
    this.setState({ anchorSubMenu: e.currentTarget })
  }

  closeSubMenu = () => {
    this.setState({ anchorSubMenu: null })
  }

  render () {
    const { locale } = this.props.locales
    const { dispatch } = this.props
    const { anchorSubMenu } = this.state
    const isMenuOpen = Boolean(anchorSubMenu)
    const SubMenu = () => {
      return (
        <Menu
          anchorEl={anchorSubMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={this.closeSubMenu}
        >
          <MenuItem onClick={this.closeSubMenu} component={Link} to="/user/me">{locale.navbar.profile}</MenuItem>
          <MenuItem onClick={this.closeSubMenu} component={Link} to="/account">{locale.navbar.my_account}</MenuItem>
        </Menu>
      )
    }

    return (
      <div>
        <Tooltip title={locale.navbar.movies} placement="bottom">
          <IconButton color="primary" component={Link} to="/movies">
            <Icon>local_movies</Icon>
          </IconButton>
        </Tooltip>
        <IconButton color="primary" onClick={this.openSubMenu}>
          <PersonIcon/>
        </IconButton>
        <SubMenu />
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
