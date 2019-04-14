import React, { Component } from 'react'
import { connect } from 'react-redux'
import { req, validator, checkForm } from '../../utils'
import { TextField, Button, Grid } from '@material-ui/core'
import host from '../../config'
import { alert } from '../../redux/snackbars/actions'

class ResetPassword extends Component {

  state = {
    form : {
      newpassword: '',
      repassword: '',
    },
    formErrors: {
      newpassword: [], repassword: []
    }
  }

  validate = (name) => {
    validator.value = this.state.form[name]

    if (name === 'newpassword')
      return validator.notNull().minLen(5).isPassword().errors
    else if (name === 'repassword')
      return validator.sameAs(this.state.form.newpassword).errors
  }

  onChange = (e) => {
    let name = e.target.name
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [name]: e.target.value
      }
    }, () => {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          [name]: this.validate(name)
        }
      })
    })
  }

  handleSubmit = (e) => {
    const { params } = this.props.match;
    let body = this.state.form
    const { dispatch } = this.props

    e.preventDefault()
    checkForm(body, this.validate, (errors, nbErrors) => {
      this.setState({...this.state, formErrors: errors})
      if (!nbErrors) {
        body = {
          new_password: body.newpassword,
          re_password: body.repassword
        }
        req(host + '/api/users/reset-password/' + params.token, {
          method: 'post',
          body: body
        }).then(() => {
          dispatch(alert('USER_EDIT_PASSWORD_SUCCESS', 'success'))
        }).catch(() => {
          dispatch(alert('USER_BAD_PASSWORD', 'error'))
        })
      }
    })
  }


  render() {
    const { formErrors } = this.state
    const { locale } = this.props.locales

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16} justify="center">
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.newpassword.length ? true : false}
                helperText={locale.validator[formErrors.newpassword[0]]}
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
                error={formErrors.repassword.length ? true : false}
                helperText={locale.validator[formErrors.repassword[0]]}
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
            fullWidth
            style={{marginTop:'5px'}}
          >
            {locale.account.change_password}
          </Button>
        </form>
      </div>
    );
  }

}


export default connect(state => state)(ResetPassword);
