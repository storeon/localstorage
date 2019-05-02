[![GitHub issues](https://img.shields.io/github/issues/polemius/storeon-localstorage.svg)](https://github.com/polemius/storeon-localstorage/issues)
[![GitHub license](https://img.shields.io/github/license/polemius/storeon-localstorage.svg)](https://github.com/polemius/storeon-localstorage/blob/master/LICENSE)
![npm](https://img.shields.io/npm/v/storeon-localstorage.svg)

# storeon-localstorage

The module for [storeon] state manager. This module store and sync state to local storage.

* **Small.** 185 B (minified and gzipped). No dependencies.
  It uses [Size Limit] to control size.

[Size Limit]: https://github.com/ai/size-limit
[storeon]: https://github.com/storeon/storeon

## Installation

```
yarn add storeon-localstorage
```

## Usage

```js
import persistState from 'storeon-localstorage'

const store = createStore([
  /* modules */
 persistState(), 
])
```

### persistState(paths, config)

```js
type paths = Void | Array<String>
```

If no pass the `paths` value then `persistState` store in local storage all state.

```js
type config.key = String
```

Default value of `config.key` is `storeon`. This key used to store date in local storage.

## EXAMPLE

In this example the state of count is saving in local storage. The first parameter of `persistState` describe what should be save and synchronize. After refreshing the page, the module `storeon-localstorage` read the local storage and update the state. 

```js
import createStore from 'storeon'
import persistState from 'storeon-localstorage'

// Initial state, reducers and business logic are packed in independent modules
let increment = store => {
  // Initial state
  store.on('@init', () => ({ count: 0 }))
  // Reducers returns only changed part of the state
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

export const store = createStore([
  increment,
  persistState(['count'])
])
```

```js
import useStoreon from 'storeon/react' // or storeon/preact

export default const Counter = () => {
  // Counter will be re-render only on `state.count` changes
  const { dispatch, count } = useStoreon('count')
  return <button onClick={() => dispatch('inc')}>{count}</button>
}
```

```js
import StoreContext from 'storeon/react/context'

render(
  <StoreContext.Provider value={store}>
    <Counter />
  </StoreContext.Provider>,
  document.body
)
```

## LICENSE

MIT

## Acknowledgments

This module based on [redux-localstorage](https://github.com/elgerlambert/redux-localstorage).
