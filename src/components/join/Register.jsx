import React from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import validator from '../../utils/validator'
import req from '../../utils/req'
import { enqueueSnackbar } from '../../redux/snackbars/actions'
import { login } from '../../redux/auth/actions'
import api from '../../config'

class Register extends React.Component {

  state = {
    register: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      repassword: ''
    },
    file : {},
    formErrors: {
      username: [], firstname: [], lastname: [], email: [], password: [], repassword: []
    }
  }

  handleSubmit = (e) => {
    const { dispatch, locales } = this.props
    const { locale } = locales
    e.preventDefault()

    this.checkForm((nbErrors) => {
      const { password, username, firstname, lastname, email } = this.state.register
      let datas = {
        plainPassword: password,
        username, email, firstname, lastname
      }
      if (!nbErrors) {
        req(api + '/users', {
          method: 'post', body: datas
        })
        .then(() => {
          dispatch(login({username: datas.username, password: datas.plainPassword}, () => {
            const formData = new FormData();
            formData.append('file', this.state.file)
            req(api + '/media_objects/avatar/create', {
              method: 'post',
              contentType:'multipart/form-data',
              body: formData,
              token: true
            })
          }))
          dispatch(enqueueSnackbar(locale.REGISTER_SUCCESS, 'success'))
        })
        .catch(err => {
          //
        })
      }
    });
  }

  validate = (name) => {
    const value = this.state.register[name]
    let errors = []
    validator.value = value

    if (name === 'username')
      errors = validator.notNull().minLen(3).maxLen(20).errors
    else if (name === 'firstname')
      errors = validator.notNull().maxLen(40).errors
    else if (name === 'lastname')
      errors = validator.notNull().maxLen(40).errors
    else if (name === 'email')
      errors = validator.isEmail().errors
    else if (name === 'password')
      errors = validator.notNull().minLen(5).errors
    else if (name === 'repassword')
      errors = validator.sameAs(this.state.register.password).errors
    return errors
  }

  checkForm = (callback) => {
    let errors = {}
    let nbErrors = 0
    for (let k in this.state.register) {
      errors[k] = this.validate(k)
      if (errors[k].length)
        nbErrors++
    }
    this.setState({
      ...this.state,
      formErrors: errors
    }, () => {
      if (callback) callback(nbErrors)
    })
  }

  onChange = (e) => {
    let name = e.target.name
    this.setState({
      ...this.state,
      register: {
        ...this.state.register,
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

  onFileChange = (e) => {
    const file = e.target.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let image = reader.results
    this.setState({...this.state, file, image})
  }

  render () {
    const { classes } = this.props
    const { locale } = this.props.locales
    const { formErrors } = this.state

    return (
      <div>
        <Typography color="primary" variant="h5">{locale.register.title}</Typography>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
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
  }
}
let RegisterExport = Register
RegisterExport = withStyles(styles)(RegisterExport)
RegisterExport = connect(state => state)(RegisterExport)
export default RegisterExport
