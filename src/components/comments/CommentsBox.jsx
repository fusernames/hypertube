import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Loading from '../../utils/jsx/Loading'
import TextField from '@material-ui/core/TextField';
import req from '../../utils/req'
import host from '../../config'

class CommentsBox extends React.Component {

  state = {
    isFetching: false,
    comment: ''
  }

  fetchComments = () => {
    this.setState({...this.state, isFetching: true})
    req(host + "/api/messages", {
        method: "POST",
        body: {
          message: {
              message: this.state.comment,
              movie: '/api/movies/' + this.props.id,
          }
        }
        }).then(res => {
          // Handle api response
          // faire un dispatch du comment pour update le tableau du comment
        }).catch(err => {
          // Handle errors
        })
  }

  onChange = (e) => {
    let name = e.target.name
    this.setState({
      ...this.state,
      [name]: e.target.value
    })
  }


  render() {
    const { isFetching, comment } = this.state
    const { locale } = this.props.locales

    return (
      <div>
        <Loading display={isFetching}/>
        <TextField
            name="comment"
            label={locale.movie.comment}
            onChange={this.onChange}
            margin="normal"
            fullWidth
        />
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
