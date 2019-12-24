/**
 * Compile a string that contains wildcard `*` to a matcher function
 *
 * @param {string} wildcard The string that needed to be compiled
 * @returns {function} The matcher function
 */
var compileWildcard = function (wildcard) {
  var regexpstring = '^' + wildcard.replace(/[*]/g, '[a-zA-Z0-9]+')
  return function (value) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return (new RegExp(regexpstring)).test(value)
  }
}

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
        var compiledMatchers = paths.map(function (wildcard) {
          return compileWildcard(wildcard)
        })
        Object.keys(state).forEach(function (stateKey) {
          compiledMatchers.forEach(function (matches) {
            if (matches(stateKey)) {
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
