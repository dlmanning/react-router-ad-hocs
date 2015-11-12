import React, { Component } from 'react'
import warning from 'warning'
import invariant from 'invariant'
import { PropTypes } from 'react-router'

/**
 * A higher-order-component that passes "history" as a property to components.
 */

function connectLifecycle (WrappedComponent) {
  class ConnectLifecycle extends Component {
    setupLifecyle (wrappedInstance) {
      if (wrappedInstance == null) {
        return
      }

      invariant(
        wrappedInstance.routerWillLeave,
        'The Lifecycle higher-order component requires you to define a routerWillLeave method'
      )

      const route = this.props.route || this.context.route

      invariant(
        route,
        'The Lifecycle higher-order component must be used on either a) a <Route component> ' +
        'or b) a descendant of a <Route component> that uses the RouteContext mixin'
      )

      this._unlistenBeforeLeavingRoute = this.context.history.listenBeforeLeavingRoute(
        route,
        wrappedInstance.routerWillLeave
      )
    }

    componentWillUnmount () {
      if (this._unlistenBeforeLeavingRoute) {
        this._unlistenBeforeLeavingRoute()
      }
    }

    render() {
      return <WrappedComponent ref={instance => this.setupLifecyle(instance)}
                               {...this.props} />
    }
  }
  
  ConnectLifecycle.contextTypes = {
    history: PropTypes.history.isRequired,
    // Nested children receive the route as context, either
    // set by the route component using the RouteContext mixin
    // or by some other ancestor.
    route: PropTypes.route
  },

  ConnectLifecycle.propTypes = {
    // Route components receive the route object as a prop.
    route: PropTypes.route
  },
  ConnectLifecycle.displayName = `ConnectLifecycle(${getDisplayName(WrappedComponent)})`
  ConnectLifecycle.WrappedComponent = WrappedComponent

  return ConnectLifecycle
}

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default connectLifecycle
