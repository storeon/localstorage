/**
 * Storeon module to persist state to local storage
 *
 * @param {(String|RegExp)[]} paths The keys of state object
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
    var initialized = false

    store.on('@init', function () {
      initialized = true

      try {
        var savedState = localStorage.getItem(key)
        if (savedState !== null) {
          return JSON.parse(savedState)
        }
      } catch (err) { }
    })
    store.on('@dispatch', function (state) {
      if (!initialized) {
        return
      }

      var stateToStore = { }
      if (paths.length === 0) {
        stateToStore = state
      } else {
        Object.keys(state).forEach(function (stateKey) {
          paths.forEach(function (condition) {
            if (typeof condition === 'string') {
              if (stateKey === condition) {
                stateToStore[stateKey] = state[stateKey]
              }
            } else if (condition.test(stateKey)) {
              stateToStore[stateKey] = state[stateKey]
            }
          })
        })
      }

      try {
        var saveState = JSON.stringify(stateToStore)
        localStorage.setItem(key, saveState)
      } catch (err) { }
    })
  }
}

module.exports = persistState
