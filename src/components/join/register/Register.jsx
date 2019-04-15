import React from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { req, validator, checkForm } from '../../../utils'
import { alert } from '../../../redux/snackbars/actions'
import { login, logout } from '../../../redux/auth/actions'
import host from '../../../config'

class Register extends React.Component {

  state = {
    form: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      repassword: ''
    },
    formErrors: {
      username: [], firstname: [], lastname: [], email: [], password: [], repassword: []
    }
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props
    e.preventDefault()
    let body = {...this.state.form}

    checkForm(body, this.validate, (errors, nbErrors) => {
      this.setState({...this.state, formErrors: errors})
      body = {...body, plainPassword: body.password}
      if (!nbErrors && this.state.file && this.state.file.size <= 100000) {
        req(host + '/api/users', {
          method: 'post', body: body
        })
        .then(() => {
          dispatch(login({username: body.username, password: body.plainPassword}, () => {
            // if there is a file, upload
            if (this.state.file) {
              const data = new FormData();
              data.append('file', this.state.file)
              req(host + '/api/media_objects/avatar/create', {
                method: 'post',
                body: data,
                useToken: true,
                contentType: false
              }).catch(err => {
                if (err._status >= 400 && err._status < 500) {
                  dispatch(alert('REGISTER_BAD_PICTURE', 'error'))
                  dispatch(logout())
                }
              })
            }
          }))
          dispatch(alert('REGISTER_SUCCESS', 'success'))
        })
        .catch(err => {
          if (err._status === 400) {
            if (err.violations[0].propertyPath === 'username') {
              dispatch(alert('REGISTER_USERNAME_TOOK', 'error'))
            } else if (err.violations[0].propertyPath === 'email') {
              dispatch(alert('REGISTER_EMAIL_TOOK', 'error'))
            }
          }
        })
      }
      else if (!this.state.file) {
        dispatch(alert('REGISTER_EMPTY_PICTURE', 'error'))
      }
      else if (this.state.file && this.state.file.size > 100000) {
        dispatch(alert('REGISTER_TOO_BIG_PICTURE', 'error'))
      }
    })
  }

  validate = (name) => {
    validator.value = this.state.form[name]

    if (name === 'username')
      return validator.notNull().minLen(3).maxLen(20).errors
    else if (name === 'firstname')
      return validator.notNull().isAlphabetic().minLen(2).maxLen(40).errors
    else if (name === 'lastname')
      return validator.notNull().isAlphabetic().minLen(2).maxLen(40).errors
    else if (name === 'email')
      return validator.isEmail().errors
    else if (name === 'password')
      return validator.notNull().minLen(5).isPassword().errors
    else if (name === 'repassword')
      return validator.sameAs(this.state.form.password).errors
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
        ...this.state,
        formErrors: {
          ...this.state.formErrors,
          [name]: this.validate(name)
        }
      })
    })
  }

  onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      let reader = new FileReader()
      reader.onload = () => {
        this.setState({...this.state, image: reader.result}, () => {
          this.setState({...this.state, file: file})
        })
      }
      reader.readAsDataURL(file)
    }
  }

  render () {
    const { classes } = this.props
    const { locale } = this.props.locales
    const { formErrors } = this.state

    return (
      <div>
        <Typography color="primary" variant="h5">{locale.register.title}</Typography>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16} justify="center">
            <Grid item xs={12}>
              <TextField
                error={formErrors.username.length ? true : false}
                helperText={locale.validator[formErrors.username[0]]}
                name="username"
                label={locale.global.username}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.firstname.length ? true : false}
                helperText={locale.validator[formErrors.firstname[0]]}
                name="firstname"
                label={locale.global.firstname}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.lastname.length ? true : false}
                helperText={locale.validator[formErrors.lastname[0]]}
                name="lastname"
                label={locale.global.lastname}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            {this.state.image &&
              <Grid item xs={12} sm={6} md={7} lg={6}>
                <div
                  className={classes.avatar}
                  style={{backgroundImage:'url(' + this.state.image + ')'}}
                >
                </div>
              </Grid>
            }
            <Grid item xs={12}>
              <input accept="image/*" id="contained-button-file" type="file" style={{display: 'none'}} onChange={this.onFileChange}/>
              <label htmlFor="contained-button-file">
                <Button color="primary" component="span" fullWidth>
                  {locale.register.upload}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={formErrors.email.length ? true : false}
                helperText={locale.validator[formErrors.email[0]]}
                name="email"
                label={locale.global.email}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.password.length ? true : false}
                helperText={locale.validator[formErrors.password[0]]}
                type="password"
                name="password"
                label={locale.global.password}
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
            className={classes.button}
            fullWidth
          >
            {locale.register.btn}
          </Button>
        </form>
      </div>
    )
  }
}

const styles = {
  button: {
    marginTop: '10px'
  },
  avatar: {
    width: '100%',
    paddingBottom: '100%',
    backgroundColor: '#222',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto',
    borderRadius: '5px'
  }
}
let RegisterExport = Register
RegisterExport = withStyles(styles)(RegisterExport)
RegisterExport = connect(state => state)(RegisterExport)
export default RegisterExport
