/**
 * Storeon module to persist state to local storage
 *
 * @param {String|String[]} path The keys of state object
 *    that will be store in local storage
 * @param {Object} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 */
const persistState = function (path, config = { key: 'storeon' }) {
  const serialize = function (data) { return JSON.stringify(data) }
  const deserialize = function (data) { return JSON.parse(data) }
  const key = config.key

  return function (store) {
    store.on('@init', function () {
      try {
        const savedState = localStorage.getItem(key)
        if (savedState === null) {
          return {}
        }
        return deserialize(savedState)
      } catch (err) {
        return {}
      }
    })
    store.on('@dispatch', function (state, data) {
      const event = data[0]
      if (event === '@init') {
        return
      }

      let stateToStore = { }
      if (typeof path === 'string') {
        stateToStore = { [path]: state[path] }
      } else if (Array.isArray(path)) {
        path.forEach(function (p) {
          stateToStore[p] = state[p]
        })
      } else {
        stateToStore = state
      }

      try {
        const saveState = serialize(stateToStore)
        localStorage.setItem(key, saveState)
      } catch (err) {
        console.error(err)
      }
    })
  }
}

module.exports = persistState
