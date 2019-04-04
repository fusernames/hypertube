import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import req from '../../utils/req'
import host from '../../config'

class CommentsBox extends React.Component {

  state = {
    isFetching: false,
    comment: ''
  }

  handleSubmit = (e) => {
    e.preventDefault()
    document.querySelector("#message").value = '';
    if (this.state.isFetching) {
      // Alert that already fetching ?
      return;
    }
    this.setState({
      ...this.state,
      isFetching: true
    })
    req(host + "/api/messages", {
      useToken: true,
      method: "POST",
      body: {
        owner: '/api/users/' + this.props.auth.user.id,
        message: this.state.comment,
        movie: '/api/movies/' + this.props.id,
      }
    }).then(res => {
      // Handle api response
      this.setState({
        comment: '',
        isFetching: false
      });
      this.props.addComment(this.props.id)
    }).catch(err => {
      // Handle errors
    })
  }

  onChange = (e) => {
    let name = e.target.name
    this.setState({
      ...this.state,
      [name]: e.target.value,
    })
  }


  render() {
    const { locale } = this.props.locales

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField id="message"
            name="comment"
            label={locale.movie.comment}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />
        </form>
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
let CommentsBoxExport = CommentsBox
CommentsBoxExport = withStyles(styles)(CommentsBoxExport)
CommentsBoxExport = connect(mapStateToProps)(CommentsBoxExport)
export default CommentsBoxExport
