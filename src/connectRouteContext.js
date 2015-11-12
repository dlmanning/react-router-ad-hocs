/**
 * The RouteContext higher-order component provides a convenient way
 * for route components to set the route in context. This is needed
 * for routes that render elements that want to use the Lifecycle
 * higher-order component to prevent transitions.
 */

import React, { Component } from 'react'
import { PropTypes } from 'react-router'

function connectRouteContext (WrappedComponent) {
  class ConnectRouteContext extends Component {
    getChildContext () {
      return {
        route: this.props.route
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }

  }

  ConnectRouteContext.propTypes = { route: PropTypes.route.isRequired }
  ConnectRouteContext.childContextTypes = { route: PropTypes.route.isRequired }
  ConnectRouteContext.displayName = `ConnectRouteContext(${getDisplayName(WrappedComponent)})`
  ConnectRouteContext.WrappedComponent = WrappedComponent

  return ConnectRouteContext
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default connectRouteContext
