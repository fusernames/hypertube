import React, { Component } from 'react'
import Informations from './Informations'
import Password from './Password'
import { Paper } from '@material-ui/core'


class Account extends Component {

  render() {
    return (
      <div>
        <Paper style={{padding:'15px 20px', marginBottom:'20px'}}>
          <Informations/>
        </Paper>
        <Paper style={{padding:'15px 20px'}}>
          <Password/>
        </Paper>
      </div>
    );
  }

}

export default Account
