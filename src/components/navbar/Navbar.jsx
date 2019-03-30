import React from 'react'
import { connect } from 'react-redux'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import SideNav from './SideNav'
import LoggedNav from './LoggedNav'
import { Link } from 'react-router-dom'
import { Button, AppBar, Toolbar, IconButton, Typography, InputBase } from '@material-ui/core'
import { toggleLanguage } from '../../redux/locales/actions'
import { SearchTwoTone as SearchIcon } from '@material-ui/icons'
import { fetchMovies } from '../../redux/search/actions'
import history from '../../utils/history'

class Navbar extends React.Component {

  state = {
    sideNav: false
  }

  searchChange = (e) => {
    if (history.location.pathname !== '/')
      history.push('/')
    this.props.dispatch(fetchMovies({word: e.target.value}))
  }

  toggleSideNav = () => {
    this.setState({
      sideNav: !this.state.sideNav
    })
  }

  componentWillMount() {

  }

  render () {
    const { classes, auth, locales, dispatch } = this.props
    const { locale } = locales

    return (
      <div>
        <div className={classes.root}>
          <AppBar position="fixed" color="secondary">
            <Toolbar>
              {auth.logged &&
                <IconButton className={classes.menuButton} color="primary" aria-label="Menu" onClick={this.toggleSideNav}>
                  <MenuIcon />
                </IconButton>
              }
              <Typography color="inherit" component={Link} to="/" className={classes.grow} variant="h6" style={{textDecoration: 'none'}}>
                <div className={classes.sectionDesktop}>
                  HyperTube
                </div>
              </Typography>
              {auth.logged &&
                <div className={classes.searchBox}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase placeholder={locale.navbar.search} onChange={this.searchChange} />
                </div>
              }
              <div className={classes.sectionDesktop}>
                {auth.logged && <LoggedNav handleLogout={this.handleLogout} />}
              </div>
              <Button
                color="inherit"
                onClick={() => { dispatch(toggleLanguage()) }}
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
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  searchBox: {
    background:'rgba(255,255,255,0.15)',
    padding:'0 10px',
    borderRadius:'3px',
    paddingLeft:'40px',
    position:'relative',
    marginRight:'10px'
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
