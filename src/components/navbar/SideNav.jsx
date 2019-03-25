import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core'
import { NotificationsTwoTone as NotificationsIcon } from '@material-ui/icons'
import { CancelTwoTone as CancelIcon } from '@material-ui/icons'
import { PersonTwoTone as PersonIcon } from '@material-ui/icons'
import { SettingsTwoTone as SettingsIcon } from '@material-ui/icons'
import { HomeTwoTone as HomeIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { logout } from '../../redux/auth/actions'

class SideNav extends React.Component {

  render () {
    const { classes, auth, dispatch } = this.props;
    const { locale } = this.props.locales

    function LoggedSide() {
      return (
        <div className={classes.list}>
          <List>
            <ListItem button key={locale.navbar.home} component={Link} to="/">
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.home} />
            </ListItem>
            <Divider />
            <ListItem button key={locale.navbar.notifications}>
              <ListItemIcon><NotificationsIcon/></ListItemIcon>
              <ListItemText className={classes.itemText} primary={locale.navbar.notifications} />
            </ListItem>
            <ListItem button key={locale.navbar.profile} component={Link} to="/user/me">
              <ListItemIcon><PersonIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.profile} />
            </ListItem>
            <ListItem button key={locale.navbar.my_account} component={Link} to="/account">
              <ListItemIcon><SettingsIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.my_account} />
            </ListItem>
            <Divider />
            <ListItem button key={locale.navbar.logout} onClick={() => { dispatch(logout()) }}>
              <ListItemIcon><CancelIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.logout} />
            </ListItem>
          </List>
        </div>
      )
    }

    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.toggleSideNav}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.toggleSideNav}
            onKeyDown={this.props.toggleSideNav}
          >
          {auth.logged && <LoggedSide/>}
          </div>
        </Drawer>
      </div>
    )
  }
}

const styles = {
  list: {
    width: 250,
  },
  itemText:{
    fontWeight: '500'
  }
}
function mapStateToProps(state) {
  return state
}
let SideNavExport = SideNav
SideNavExport = withStyles(styles)(SideNavExport)
SideNavExport = connect(mapStateToProps)(SideNavExport)

export default SideNavExport
