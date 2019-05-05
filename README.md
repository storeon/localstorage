[![GitHub issues](https://img.shields.io/github/issues/storeon/storeon-localstorage.svg)](https://github.com/storeon/storeon-localstorage/issues)
[![GitHub license](https://img.shields.io/github/license/storeon/storeon-localstorage.svg)](https://github.com/storeon/storeon-localstorage/blob/master/LICENSE)
![npm](https://img.shields.io/npm/v/@storeon/localstorage.svg)

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

# storeon-localstorage

The 185 bytes module for [storeon] to store and sync state to `localStorage`. It restores state from `localStorage` during page loading and saves state on every change.
It uses [Size Limit] to control size.

[Size Limit]: https://github.com/ai/size-limit
[storeon]: https://github.com/storeon/storeon

## Installation

```
yarn add @storeon/localstorage
```

## Usage

If you want to store and sync state to `localStorage` you should import the `persistState` from `@storeon/localstorage` and add this module to `createStore`.

```js
import useStoreon from 'storeon/react';
import StoreContext from 'storeon/react/context'

import createStore from 'storeon'
import persistState from '@storeon/localstorage'

let name = store => {
  store.on('@init', () => ({ name: '' }))

  store.on('save', (state, name) => ({ name: name }))
}

const store = createStore([
  name,
  persistState()
])
```

Here you can see that the form ask user the name and after that show this name.

```js
const Form = () => {
const { dispatch, name } = useStoreon('name')

return (
  <React.Fragment>
    {name !== '' && <h3>Hello {name}!</h3>}
    {name === '' &&
      <div>
        <label>Name</label>
        <input type="text" id="name" />
        <br/>
        <button onClick={
          () => dispatch('save', document.getElementById('name').value)
        }>Save</button>
      </div>
    }
  </React.Fragment>
)
}

const App = () => {
  return (
    <div className="App">
      <StoreContext.Provider value={store}>
        <Form />
      </StoreContext.Provider>,
    </div>
  );
}
```

Event after refresh the page the state is updating from `localStorage`. And user see the greeting message.

![Example of store state to local storage](example.gif)

## LICENSE

MIT

## Acknowledgments

This module based on [redux-localstorage](https://github.com/elgerlambert/redux-localstorage).
