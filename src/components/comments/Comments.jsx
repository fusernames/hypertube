import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Loading from '../../utils/jsx/Loading'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import req from '../../utils/req'
import host from '../../config'

class Comments extends React.Component {

  state = {
    isFetching: false,
    comments: []
  }

  fetchComments = (id) => {
    this.setState({...this.state, isFetching: true})
    req(host + '/api/movies/' + id + '/messages', {useToken: true})
    .then(res => {
        // console.log(res['hydra:member']);
        this.setState({
            isFetching: false,
            comments: res['hydra:member']
        })
        //dispatch les comments 
    })
  }

  componentWillMount() {
    this.fetchComments(this.props.id)
  }

  render() {
    const { isFetching, comments } = this.state
    // const { classes } = this.props
    // const { locale } = this.props.locales

    return (
      <div>
        <Loading display={isFetching}/>
        <List>
        {comments.map(comment => {
            return (
                <ListItem key={comment.id}>
                    {/* <ListItemAvatar>
                        <Avatar src="/static/images/avatar/2.jpg" />
                    </ListItemAvatar> */}
                    <ListItemText
                        primary='Username'
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
