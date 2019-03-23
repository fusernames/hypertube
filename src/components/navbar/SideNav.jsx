import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Divider } from '@material-ui/core'
import { NotificationsTwoTone as NotificationsIcon } from '@material-ui/icons'
import { CancelTwoTone as CancelIcon } from '@material-ui/icons'
import { PersonTwoTone as PersonIcon } from '@material-ui/icons'
import { SettingsTwoTone as SettingsIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { logout } from '../../redux/auth/actions'

class SideNav extends React.Component {

  render () {
    const { classes, auth, dispatch } = this.props;
    const { locale } = this.props.locales

    function LoggedSide() {
      let i = 0;
      return (
        <div className={classes.list}>
          <List>
            <ListItem button key={locale.navbar.notifications}>
              <ListItemIcon><NotificationsIcon/></ListItemIcon>
              <ListItemText className={classes.itemText} primary={locale.navbar.notifications} />
            </ListItem>
            <ListItem button key={locale.navbar.logout} onClick={() => { dispatch(logout()) }}>
              <ListItemIcon><CancelIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.logout} />
            </ListItem>
            <ListItem button key={locale.navbar.profile} component={Link} to="/">
              <ListItemIcon><PersonIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.profile} />
            </ListItem>
            <ListItem button key={locale.navbar.my_account} component={Link} to="/account">
              <ListItemIcon><SettingsIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.my_account} />
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
    fontWeight: 'bold'
  }
}
function mapStateToProps(state) {
  return state
}
let SideNavExport = SideNav
SideNavExport = withStyles(styles)(SideNavExport)
SideNavExport = connect(mapStateToProps)(SideNavExport)

export default SideNavExport
