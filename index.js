/**
 * Storeon module to persist state to local storage
 *
 * @param {String[]} paths The keys of state object
 *    that will be store in local storage
 * @param {Object} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 */
const persistState = function (paths = [], config = { key: 'storeon' }) {
  const key = config.key

  return function (store) {
    store.on('@init', function () {
      try {
        const savedState = localStorage.getItem(key)
        if (savedState === null) {
          return {}
        }
        return JSON.parse(savedState)
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
      if (paths.length === 0) {
        stateToStore = state
      } else {
        paths.forEach(function (p) {
          stateToStore[p] = state[p]
        })
      }

      try {
        const saveState = JSON.stringify(stateToStore)
        localStorage.setItem(key, saveState)
      } catch (err) {

      }
    })
  }
}

module.exports = persistState
