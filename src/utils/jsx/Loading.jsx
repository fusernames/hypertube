import { CircularProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'

function Loading(props) {
  const { classes, display } = props
  return (
    <div>
      {display && <div className={classes.progress}><CircularProgress/></div>}
    </div>
  )
}

const styles = {
  progress: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center'
  }
}
export default withStyles(styles)(Loading)
