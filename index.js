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
let persistState = function (paths, config) {
  config = config || { }
  paths = paths || []

  let key = config.key || 'storeon'
  let storage = config.storage || localStorage

  return function (store) {
    let initialized = false

    store.on('data/update', (_, data) => {
      return data
    })

    store.on('@init', () => {
      initialized = true

      try {
        let savedState = storage.getItem(key)
        if (savedState !== null) {
          if (typeof savedState.then === 'function') {
            savedState.then(value => {
              store.dispatch('data/update', JSON.parse(value))
            }).catch(() => {})
          } else {
            store.dispatch('data/update', JSON.parse(savedState))
          }
        }
      } catch (err) { }
    })
    store.on('@dispatch', (state, event) => {
      if (!initialized || event[0] !== '@changed') {
        return
      }

      let stateToStore = { }
      if (paths.length === 0) {
        stateToStore = state
      } else {
        Object.keys(state).forEach(stateKey => {
          paths.forEach(condition => {
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
        let saveState = JSON.stringify(stateToStore)
        return storage.setItem(key, saveState)
      } catch (err) { }
    })
  }
}

module.exports = persistState
