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
 */
var persistState = function (paths, config) {
  config = config || { }
  paths = paths || []

  var key = config.key || 'storeon'
  var storage = config.storage || localStorage

  return function (store) {
    var initialized = false

    store.on('data/update', function (_, data) {
      return data
    })

    store.on('@init', async function () {
      initialized = true

      try {
        var savedState = await storage.getItem(key)
        if (savedState !== null) {
          store.dispatch('data/update', JSON.parse(savedState))
        }
      } catch (err) { }
    })
    store.on('@dispatch', async function (state, event) {
      if (!initialized || event[0] !== '@changed') {
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
        await storage.setItem(key, saveState)
      } catch (err) { }
    })
  }
}

module.exports = persistState
