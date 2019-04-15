import React, { Component } from 'react';
import { Typography, Grid, Chip, IconButton, Icon } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import req from '../../utils/req'
import host from '../../config'
import { alert } from '../../redux/snackbars/actions'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Link } from 'react-router-dom'

class Torrents extends Component {

  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    torrents:[]
  }

  fetchStatus = (torrent, callback) => {
    let body = (torrent.magnet ? {torrent_link: torrent.magnet} : {torrent_link: torrent.url})
    req(host + '/api/movies/torrent/status', {
      useToken: true,
      body: body,
      method: 'post'
    }).then((res) => {
      if (res._status === 201) {
        torrent.download = true
        torrent.movieId = res.movieId
        torrent.downloading = undefined
      } else if (res._status === 200) {
        torrent.download = res.success >= 100 ? true : undefined
        torrent.movieId = res.movieId
        torrent.downloading = res.success >= 100 ? undefined : res.success
      }
      if (callback) callback()
    }).catch(err => {
      if (err._status === 404) {
        torrent.download = false
      }
      if (callback) callback()
    })
  }

  setStatus = (t, refresh = false) => {
    this.setStateCheck({
      ...this.state,
      torrents: t
    })
  }

  fetchTorrentsStatus = (torrents) => {
    let cpy = [...torrents]
    cpy.forEach(torrent => {
      this.fetchStatus(torrent, () => {
        this.setStatus(cpy, true)
      })
    })
  }

  refreshStatus = () => {
    if (this._isMounted) {
      let cpy = [...this.state.torrents]
      for (let i in cpy) {
        if (cpy[i].downloading !== undefined) {
          this.fetchStatus(cpy[i], () => {
            this.setStatus(cpy)
          })
        }
      }
    }
  }

  handleDownload = (i) => {
    const { dispatch } = this.props
    const torrents = [...this.state.torrents]
    torrents[i].downloading = 0
    torrents[i].download = undefined
    this.setStateCheck({
      ...this.state,
      torrents: torrents
    })
    const torrent = torrents[i]
    const { url, magnet } = torrent
    let body = (magnet ? {torrent_magnet: magnet} : {torrent_url: url})
    body.apiid = this.props.apiId
    req(host + '/api/movies/torrent/download', {
      useToken: true,
      body: body,
      method: 'post'
    }).catch(err => {
      dispatch(alert(err, 'error'))
    })
  }

  componentWillMount() {
    this._isMounted = true
    this.fetchTorrentsStatus(this.props.torrents)
    setInterval(this.refreshStatus, 2000);
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { locales, classes } = this.props
    const { locale } = locales
    const { torrents } = this.state
    return (
        <div>
          <Icon color="primary" style={{float:'right'}}>link</Icon>
          <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.torrents}</Typography>
          <Grid container spacing={8}>
          {torrents.map((torrent, i) => {
            return (
              <Grid item key={'torrent' + i} className={classes.torrent} xs={12}>
                <div>
                  <Chip label={torrent.quality} variant="outlined" style={{marginRight:'10px', width:'100px'}}/>
                  <Typography inline variant="caption">{torrent.size}</Typography>
                </div>
                <div>
                  {torrent.download === false &&
                    <IconButton style={{padding:'5px'}} onClick={() => this.handleDownload(i)}>
                      <Icon>get_app</Icon>
                      <CircularProgress
                        color="primary"
                        variant="static"
                        value={torrent.downloading}
                        style={{position: 'absolute', top: '-3px'}}
                      />
                    </IconButton>
                  }
                  {torrent.download === true &&
                    <IconButton style={{padding:'5px'}} component={Link} to={"/stream/" + torrent.movieId}>
                        <Icon >play_arrow</Icon>
                    </IconButton>
                  }
                  {torrent.downloading !== undefined &&
                    <div style={{display: 'flex', justifyContent: 'center', position:'relative', padding:'5px', width:'24px', height:'24px', boxSizing: 'content-box', alignItems:'center'}}>
                      <CircularProgress
                        color="primary"
                        variant="static"
                        value={torrent.downloading}
                        style={{position: 'absolute', top: '-5px', left: '-5px'}}
                      >
                      </CircularProgress>
                      <Typography variant="caption">{Math.round(torrent.downloading) + '%'}</Typography>
                    </div>
                  }
                </div>
              </Grid>
            )
          })}
          </Grid>
        </div>
    );
  }
}

const styles = {
  torrent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

export default withStyles(styles)(connect(state => state)(Torrents))
