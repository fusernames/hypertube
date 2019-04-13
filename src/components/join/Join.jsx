import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import Login from './login/Login'
import Register from './register/Register'

class Join extends React.Component {
  render() {
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} lg={6}>
          <Paper style={{padding:'20px'}}>
            <Login />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper style={{padding:'20px'}}>
            <Register />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default Join
