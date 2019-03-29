import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import req from '../../utils/req'
import { enqueueSnackbar } from '../../redux/snackbars/actions'
import api from '../../config'

class Profile extends Component {

  state = {
    username: undefined,
    firstname: undefined,
    lastname: undefined,
  }

  fetchUser(id) {
    const { dispatch } = this.props
    req(api + '/users/' + id, {token: true})
    .then(res => {
      this.setState({
        username: res.username,
        firstname: res.firstname,
        lastname: res.lastname
      })
    }).catch(err => {
      if (err.status === 404)
        dispatch(enqueueSnackbar('User not found', 'error'))
    })
  }

  componentWillMount() {
    this.fetchUser(this.props.match.params.id)
  }

  render() {
    const { firstname, lastname, username } = this.state
    const { locale } = this.props.locales
    const { classes } = this.props

    if (!username) return null
    return (
      <div>
        <Typography align="center" color="primary" variant="h4">{username}</Typography>
        <Grid container spacing={8} justify="center" style={{marginTop:'20px'}}>
          <Grid item xs={12} sm={7}>
            <div
              className={classes.avatar}
              style={{backgroundImage:'url(https://i.imgflip.com/2wr8df.jpg)'}}
            >
            </div>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <Typography variant="caption" color="textPrimary" inline>{locale.global.firstname}</Typography>
                  <Typography variant="caption" color="textPrimary" align="right" inline style={{float:'right'}}>{firstname}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <Typography variant="caption" color="textPrimary" inline>{locale.global.lastname}</Typography>
                  <Typography variant="caption" color="textPrimary" align="right" inline style={{float:'right'}}>{lastname}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }

}

const styles = {
  paper: {
    padding:'15px 20px'
  },
  avatar: {
    width: '100%',
    paddingBottom: '100%',
    backgroundColor: '#222',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto',
    borderRadius: '5px'
  }
}
const mapStateToProps = state => { return state }
let ProfileExport = Profile
ProfileExport = withStyles(styles)(ProfileExport)
ProfileExport = connect(mapStateToProps)(ProfileExport)

export default ProfileExport
