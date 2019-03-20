import React from 'react'
import { connect } from 'react-redux'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import SideNav from './SideNav'
import UnloggedNav from './UnloggedNav'
import { Link as RouterLink } from 'react-router-dom'
import { Link, Button, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'

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
}

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
    const { classes } = this.props

    return (
      <div>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleSideNav}>
                <MenuIcon />
              </IconButton>
              <Typography className={classes.grow} variant="h6" color="inherit">
                <Link component={RouterLink} to="/" color="textPrimary">
                  Hypertube
                </Link>
              </Typography>
              {!this.props.auth.logged && <UnloggedNav />}
            </Toolbar>
          </AppBar>
        </div>
        <SideNav open={this.state.sideNav} toggleSideNav={this.toggleSideNav} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

let NavbarExport = Navbar
NavbarExport = withStyles(styles)(NavbarExport)
NavbarExport = connect(mapStateToProps)(NavbarExport)
export default NavbarExport
