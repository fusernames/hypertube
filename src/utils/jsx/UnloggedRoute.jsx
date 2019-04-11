import React from 'react';
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux';

function UnloggedRoute ({component: Component, ...rest}) {
  const { auth } = rest;
  return (
    <Route
      {...rest}
      render={(props) => !auth.logged
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  );
}

export default connect(state => state)(UnloggedRoute);