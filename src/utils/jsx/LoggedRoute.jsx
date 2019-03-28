import React from 'react';
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'

function PrivateRoute ({component: Component, ...rest}) {
  const { auth } = rest;
  return (
    <Route
      {...rest}
      render={(props) => auth.logged
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  );
}

const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps)(PrivateRoute);
