import React from 'react'
import { connect } from 'react-redux'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import SideNav from './SideNav'
import UnloggedNav from './UnloggedNav'
import LoggedNav from './LoggedNav'
import { Link } from 'react-router-dom'
import { Button, AppBar, Toolbar, IconButton, Typography, Badge, InputBase, Paper } from '@material-ui/core'
import { toggleLanguage } from '../../redux/locales/actions'
import { logout } from '../../redux/auth/actions'
import { SearchTwoTone as SearchIcon } from '@material-ui/icons'

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
    const { classes, auth, locales, dispatch } = this.props
    const { locale } = locales
    console.log(auth.logged)

    return (
      <div>
        <div className={classes.root}>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleSideNav}>
                <MenuIcon />
              </IconButton>
              <Typography component={Link} to="/" className={classes.grow} variant="h6" style={{textDecoration: 'none'}}>
                <div className={classes.sectionDesktop}>
                HyperTube
                </div>
              </Typography>
              {auth.logged &&
                <div className={classes.searchBox}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase placeholder={locale.navbar.search} />
                </div>
              }
              <div className={classes.sectionDesktop}>
                {auth.logged
                  ? <LoggedNav handleLogout={this.handleLogout} />
                  : <UnloggedNav />
                }
              </div>
              <Button
                color="inherit"
                onClick={() => { dispatch(toggleLanguage(locales.code)) }}
              >
                {locales.code}
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <SideNav open={this.state.sideNav} toggleSideNav={this.toggleSideNav} />
      </div>
    )
  }
}

const styles = theme => ({
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
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  searchBox: {
    background:'rgba(255,255,255,0.15)',
    padding:'0 10px',
    borderRadius:'3px',
    paddingLeft:'40px',
    position:'relative',
    margin:'0 10px'
  },
  searchIcon: {
    position:'absolute',
    left:'10px',
    top:'4px'
  }
})
function mapStateToProps(state) {
  return state
}
let NavbarExport = Navbar
NavbarExport = withStyles(styles)(NavbarExport)
NavbarExport = connect(mapStateToProps)(NavbarExport)

export default NavbarExport
