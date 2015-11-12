# react-router-ad-hocs

This is a set of three higher-order components that do (more-or-less) the same things as react-router's mixins. You can use these with React components that you've defined as ES6 classes or with those fancy, stateless, functional components that all the kids are talking about.

Here's how they work:

```javascript
import React, { Component } from 'react'
import { connectHistory } from 'react-router-ad-hocs'

class MySpecialLink extends Component {
  handleClick () {
    this.props.history.pushState(null, '/foo')
  }
  render () {
    return (
      <h1 onClick={() => this.handleClick()}>
        Click Me!
      </h1>
    )
  }
}

export default connectHistory(MySpecialLink)
```
## API

### `connectHistory(ComponentToBeWrapped)`

#### Parameters:
ComponentToBeWrapped: Any React component
#### Returns:
A wrapped version of ComponentToBeWrapped that will receive react-router's `history` object as a prop. See the [History mixin](https://github.com/rackt/react-router/blob/master/docs/API.md#history-mixin) documentation for more information. If you are already passing a prop called `history` yourself, it will be overwritten by `connectHistory()`, so don't do that.

### `connectLifecycle(ComponentToBeWrapped)`

#### Parameters:
ComponentToBeWrapped: Any React component that defines a `routerWillLeave` method
#### Returns:
A wrapped version of ComponentToBeWrapped. ComponentToBeWrapped's `routerWillLeave` method will be called immediately before the router leaves the current route, with the ability to cancel the navigation. See the [Lifecycle mixin](https://github.com/rackt/react-router/blob/master/docs/API.md#lifecycle-mixin) documentation for more information.

### `connectRouteContext(ComponentToBeWrapped)`
#### Parameters:
ComponentToBeWrapped: Any React component that receives `route` as a prop (i.e. a Route component)

#### Returns:
A wrapped version of ComponentToBeWrapped that provides `route` on context for all its children. You'd use this on Route components whose children want to use `connectLifecycle()` because `connectLifecycle()` needs to know about the current `route`. See the [RouteContext mixin](https://github.com/rackt/react-router/blob/master/docs/API.md#routecontext-mixin) documentation for more information.

## Caveats and differences from react-router mixins:

1. `connectHistory()` passes history as a prop, whereas the `History` mixin adds it directly to your component definition and makes it accessible through `this.history`. I decided to pass it as a prop because props are more easily composable. It's probably not a big deal either way, so I guess let me know if this is a problem for you.

2. If you're using `connectHistory()` and `connectLifecycle()` together on the same component, it's important that `connectLifecycle()` be applied first (i.e. receive the component first in the composition chain) because it needs to directly access the unwrapped component's `.routerWillLeave()` method, which will otherwise be obscured by `connectHistory()`. So do this:

```javascript
const WrappedComponent = connectHistory(connectLifecycle(UnwrappedComponent))
```

not this:

```javascript
const WrappedComponent = connectLifecycle(connectHistory(UnwrappedComponent))
```

That should cover everything. Have fun!
