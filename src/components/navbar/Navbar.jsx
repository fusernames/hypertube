import React from 'react'
import { connect } from 'react-redux'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import SideNav from './SideNav'
import UnloggedNav from './UnloggedNav'
import { Link as RouterLink } from 'react-router-dom'
import { Link, Button, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import { toggleLanguage } from '../../store/locales/locales.actions'

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

  toggleLanguage = () => {
    this.props.dispatch(toggleLanguage(this.props.locales.code));
  }

  render () {
    const { classes, auth, locales } = this.props
    const { locale } = locales

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
              {!auth.logged && <UnloggedNav />}
              <Button color="inherit" onClick={this.toggleLanguage}>{locales.code}</Button>
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
