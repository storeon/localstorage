/**
 * Storeon module to persist state to local storage
 *
 * @param {(String|RegExp)[]} paths The keys of state object
 *    that will be store in local storage
 * @param {Object} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 * @param {Storage} [config.storage] Can be set as `sessionStorage` or
 *    `localStorage`. Defaults value is `localStorage`.
 * @param {Function} [config.serializer] Function that will serialize
 *    your data. Should take object as an argument. Defaults to `JSON.stringify`
 * @param {Function} [config.deserializer] Function that will deserialize
 *    your data. Should take string as an argument. Defaults to `JSON.parse`
 */
let persistState = (paths, config) => {
  config = config || {}
  paths = paths || []

  if (typeof window === 'undefined') return

  let key = config.key || 'storeon'
  let storage = config.storage || localStorage
  let serializer = config.serializer || JSON.stringify
  let deserializer = config.deserializer || JSON.parse

  let onChange = state => {
    if (paths.length) {
      state = filterState(state, paths)
    }

    let saveState
    try {
      saveState = serializer(state)
    } catch (err) {
      return
    }
    storage.setItem(key, saveState)
  }

  let event = Symbol('persistState')
  return store => {
    store.on(event, (_, serializedState) => {
      try {
        return deserializer(serializedState)
      } catch (err) {}
    })

    store.on('@init', () => {
      store.on('@changed', onChange)

      let savedState = storage.getItem(key)
      if (savedState) {
        if (typeof savedState.then === 'function') {
          savedState.then(value => store.dispatch(event, value))
        } else {
          try {
            return deserializer(savedState)
          } catch (err) {}
        }
      }
    })
  }
}

let filterState = (state, paths) => {
  let filteredState = {}
  for (let key in state) {
    for (let condition of paths) {
      if ((condition.test && condition.test(key)) || condition === key) {
        filteredState[key] = state[key]
      }
    }
  }
  return filteredState
}

module.exports = { persistState }
