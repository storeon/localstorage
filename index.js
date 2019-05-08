/**
 * Storeon module to persist state to local storage
 *
 * @param {String[]} paths The keys of state object
 *    that will be store in local storage
 * @param {Object} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 */
var persistState = function (paths, config) {
  config = config || { }
  paths = paths || []

  var key = config.key || 'storeon'

  return function (store) {
    store.on('@init', function () {
      try {
        var savedState = localStorage.getItem(key)
        if (savedState === null) {
          return {}
        }
        return JSON.parse(savedState)
      } catch (err) {
        return {}
      }
    })
    store.on('@dispatch', function (state, data) {
      var event = data[0]
      if (event === '@init') {
        return
      }

      var stateToStore = { }
      if (paths.length === 0) {
        stateToStore = state
      } else {
        paths.forEach(function (p) {
          stateToStore[p] = state[p]
        })
      }

      try {
        var saveState = JSON.stringify(stateToStore)
        localStorage.setItem(key, saveState)
      } catch (err) {

      }
    })
  }
}

module.exports = persistState
