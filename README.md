[![GitHub issues](https://img.shields.io/github/issues/storeon/localstorage.svg)](https://github.com/storeon/localstorage/issues)
[![GitHub license](https://img.shields.io/github/license/storeon/localstorage.svg)](https://github.com/storeon/localstorage/blob/master/LICENSE)
![npm](https://img.shields.io/npm/v/@storeon/localstorage.svg)

# storeon-localstorage

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

The 177 bytes module for [Storeon] to store and sync state to `localStorage`. It restores state from `localStorage` during page loading and saves state on every change.
It uses [Size Limit] to control the size.

[Size Limit]: https://github.com/ai/size-limit
[Storeon]: https://github.com/storeon/storeon

## Installation

```
npm install @storeon/localstorage
```

## Usage

If you want to store and sync state to `localStorage` you should import the `persistState` from `@storeon/localstorage` and add this module to `createStore`.

```js
import createStore from 'storeon'
import persistState from '@storeon/localstorage'

let name = store => {
  store.on('@init', () => ({ name: '' }))

  store.on('save', (state, name) => ({ name: name }))
}

const store = createStore([
  name,
  persistState(['name'])
])
```

Here you can see that the form ask user the name and after that show this name.

```js
import useStoreon from 'storeon/react';
import StoreContext from 'storeon/react/context'

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
```

Event after refresh the page the state is updating from `localStorage`. And user see the greeting message.

![Example of store state to local storage](example.gif)

### persistState(paths, config)

```js
type paths = Void | Array<String>
```

If no pass the `paths` value then `persistState` store in local storage all state.

```js
type config.key = String
```

Default value of `config.key` is `storeon`. This key is using to store data in local storage.

## LICENSE

MIT

## Acknowledgments

This module based on [redux-localstorage](https://github.com/elgerlambert/redux-localstorage).
