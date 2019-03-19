import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import SideNav from './SideNav'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Navbar extends React.Component {

  state = {
    sideNav: false
  }

  toggleSideNav = () => {
    this.setState({
      sideNav: !this.state.sideNav
    })
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleSideNav}>
                <MenuIcon />
              </IconButton>
              <Typography className={classes.grow} variant="h6" color="inherit">
                Hypertube
              </Typography>
              <Button color="inherit">Register</Button>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </div>
        <SideNav open={this.state.sideNav} toggleSideNav={this.toggleSideNav} />
      </div>
    )
  }
}

export default withStyles(styles)(Navbar);
