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
import { Link } from 'react-router-dom'

class SideNav extends React.Component {

  render () {
    const { classes, auth } = this.props;
    const { locale } = this.props.locales

    function LoggedSide() {
      let i = 0;
      return (
        <div className={classes.list}>
          <List>
            <ListItem button key={i++}>
              <ListItemIcon><NotificationsIcon/></ListItemIcon>
              <ListItemText className={classes.itemText} primary={locale.navbar.notifications} />
            </ListItem>
            <ListItem button key={i++}>
              <ListItemIcon><CancelIcon/></ListItemIcon>
              <ListItemText primary={locale.navbar.logout} />
            </ListItem>
          </List>
        </div>
      )
    }

    function UnloggedSide() {
      let i = 0;
      return (
        <div className={classes.list}>
          <List>
            <ListItem component={Link} to="/register" button key={i++}>
              <ListItemText primary={locale.navbar.register} />
            </ListItem>
            <ListItem component={Link} to="/login" button key={i++}>
              <ListItemText primary={locale.navbar.login} />
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
          {auth.logged ? <LoggedSide/> : <UnloggedSide/>}
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
