import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Loading from '../../utils/jsx/Loading'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import req from '../../utils/req'
import host from '../../config'
import Moment from 'react-moment'
import 'moment/locale/fr'
import CommentsBox from './CommentsBox'

class Comments extends React.Component {

  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    isFetching: false,
    comments: [],
    page: 1,
    display: true
  }

  addComment = (id) => {
    this.setStateCheck({
      page: 1,
      comments: [],
      display: true
    }, () => {
      this.fetchComments(id);
    })
  }

  fetchComments = (id) => {
    this.setStateCheck({...this.state, isFetching: true})
    req(host + '/api/movies/' + id + '/messages.json?order[id]=DESC&page=' + this.state.page, {useToken: true})
    .then(res => {
        if (res.length) {
          this.setStateCheck({
            isFetching: false,
            comments: [...this.state.comments, ...res]
          })
        }
        else {
          this.setStateCheck({
            isFetching: false,
            display: false
          })
        }
    }).catch(ignored => {})
  }

  componentWillMount() {
    this._isMounted = true
    this.fetchComments(this.props.id)
  }

  componentDidMount() {
    window.onscroll = () => {
      if (this._isMounted === true) {
        if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 200) {
          if (this.state.display) {
            this.setStateCheck({
              isFetching: false,
              page: this.state.page + 1
            })
            this.fetchComments(this.props.id)
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { isFetching, comments} = this.state
    const { time_display } = this.props.locales.locale.movie

    return (
      <div>
        <CommentsBox id={this.props.id} addComment={this.addComment}/>
        <Loading display={isFetching}/>
        <List>
        {comments.map(comment => {
          return (
            <ListItem key={comment.id}>
              <ListItemAvatar component={Link} to={'/user/' + comment.owner.id}>
                <Avatar src={comment.owner.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                  primary={comment.owner.username}
                  secondary={comment.message}
                  style={{wordBreak: 'break-word'}}>
              </ListItemText>
              <Typography style={{wordBreak: 'keep-all', position: 'absolute', top: '5px', right:'0px'}}>
                <Moment locale={time_display} fromNow>{comment.createdAt}</Moment>
              </Typography>
            </ListItem>
          )
        })}
        </List>
      </div>
    )
  }
}

const styles = theme => ({
  img: {
    borderRadius:'5px',
    overflow:'hidden'
  },
  paper: {
    background: theme.palette.secondary.dark,
    height:'100%',
    borderRadius: '5px',
    padding:'15px 20px',
    overflow:'hidden'
  },
  frame: {
    margin: '0 -20px -19px -20px',
    width: 'calc(100% + 40px)',
    height: '20vw',
    minHeight: '250px'
  }
})
const mapStateToProps = state => { return state }
let CommentsExport = Comments
CommentsExport = withStyles(styles)(CommentsExport)
CommentsExport = connect(mapStateToProps)(CommentsExport)
export default CommentsExport
