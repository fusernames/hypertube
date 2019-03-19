import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

class SideNav extends React.Component {

  render () {
    const { classes } = this.props;
    const sideList = (
      <div>
        <List>
          {['Register', 'Login'].map((text, i) => (
            <ListItem button key={i}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </div>
    );

    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.toggleSideNav}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.toggleSideNav}
            onKeyDown={this.props.toggleSideNav}
          >
          {sideList}
          </div>
        </Drawer>
      </div>
    )
  }
}

export default withStyles(styles)(SideNav)

const styles = {
}
