import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Loading from '../../utils/jsx/Loading'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import req from '../../utils/req'
import host from '../../config'
import CommentsBox from './CommentsBox'

class Comments extends React.Component {

  _isMounted = false

  state = {
    isFetching: false,
    comments: [],
    page: 1,
    display: true
  }

  addComment = (id) => {
    this.setState({
      page: 1,
      comments: [],
      display: true
    }, () => {
      this.fetchComments(id);
    })
  }

  fetchComments = (id) => {
    this.setState({...this.state, isFetching: true})
    req(host + '/api/movies/' + id + '/messages.json?order[id]=DESC&page=' + this.state.page, {useToken: true})
    .then(res => {
        if (res.length) {
          this.setState({
            isFetching: false,
            comments: [...this.state.comments, ...res]
          })
        }
        else {
          this.setState({
            isFetching: false,
            display: false
          })
        }
    }).catch(err => {
    })
  }

  componentWillMount() {
    this.fetchComments(this.props.id)
  }

  componentDidMount() {
    this._isMounted = true
    window.onscroll = () => {
      if (this._isMounted === true) {
        if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 200) {
          if (this.state.display) {
            this.setState({
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
    const { isFetching, comments } = this.state

    return (
      <div>
        <CommentsBox id={this.props.id} addComment={this.addComment}/>
        <Loading display={isFetching}/>
        <List>
        {comments.map(comment => {
            return (
                <ListItem key={comment.id}>
                    <ListItemAvatar>
                        <Avatar src={comment.owner.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={comment.owner.username}
                        secondary={comment.message}
                    >
                    </ListItemText>
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
