import React from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

class Update extends React.Component {

  state = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    newpassword: '',
    repassword: ''
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
  }

  render () {
    const { classes } = this.props
    const { locale } = this.props.locales

    return (
      <div>
        <Typography color="primary" variant="h5">{locale.navbar.my_account}</Typography>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label={locale.global.username}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstname"
                label={locale.global.firstname}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lastname"
                label={locale.global.lastname}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" id="contained-button-file" type="file" style={{display: 'none'}}/>
              <label htmlFor="contained-button-file">
                <Button color="primary" component="span" fullWidth>
                  {locale.register.upload}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                name="email"
                label={locale.global.email}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="password"
                name="newpassword"
                label={locale.global.new_password}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="password"
                name="repassword"
                label={locale.global.repassword}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className={classes.button}
            fullWidth
          >
            {locale.account.btn}
          </Button>
        </form>
      </div>
    )
  }
}

const styles = {
  button: {
    marginTop: '10px'
  }
}
const mapStateToProps = (state) => {
  return state
}

let UpdateExport = Update
UpdateExport = withStyles(styles)(UpdateExport)
UpdateExport = connect(mapStateToProps)(UpdateExport)
export default UpdateExport
