# storeon-localstorage

## Instalation

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

### persistState(path, config)

```js
type path = Void | String | Array<String>
```

If no pass the `path` value then `persistState` store in local storage all state.

```js
type config.key = String
```

Default value of `config.key` is `storeon`. This key used to store date in local storage.

## LICENSE

MIT

## Acknowledgments

This module based on [redux-localstorage](https://github.com/elgerlambert/redux-localstorage).
