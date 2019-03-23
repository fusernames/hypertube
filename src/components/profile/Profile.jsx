import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

class Profile extends Component {

  state = {
    username: 'j.doe',
    firstname: 'John',
    lastname: 'Doe',
  }

  render() {
    const { firstname, lastname, username } = this.state
    const { locale } = this.props.locales
    const { classes } = this.props

    return (
      <div>
        <Typography color="primary" variant="h5">{username}</Typography>
        <Grid container spacing={8} justify="center" style={{marginTop:'20px'}}>
          <Grid item xs={12} sm={6}>
            <div className={classes.box}>
              <Typography color="textPrimary" inline>{locale.global.firstname}</Typography>
              <Typography color="textPrimary" align="right" inline style={{float:'right'}}>{firstname}</Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.box}>
              <Typography color="textPrimary" inline>{locale.global.firstname}</Typography>
              <Typography color="textPrimary" align="right" inline style={{float:'right'}}>{firstname}</Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.box}>
              <Typography color="textPrimary" inline>{locale.global.firstname}</Typography>
              <Typography color="textPrimary" align="right" inline style={{float:'right'}}>{firstname}</Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }

}

const styles = {
  box: {
    background:'#222', padding:'15px 20px', borderRadius:'3px'
  }
}
const mapStateToProps = state => { return state }
let ProfileExport = Profile
ProfileExport = withStyles(styles)(ProfileExport)
ProfileExport = connect(mapStateToProps)(ProfileExport)

export default ProfileExport
