
module.exports = function (config = {}) {
  const serialize = function (data) { return JSON.stringify(data) }
  const deserialize = function (data) { return JSON.parse(data) }
  return function (store) {
    store.on('@init', function () {
      try {
        const saveState = localStorage.getItem('storeon')
        if (saveState === null) {
          return {}
        }
        return deserialize(saveState)
      } catch (err) {
        return {}
      }
    })
    store.on('@dispatch', function (state, data) {
      const event = data.event
      const key = config.key
      if (key === undefined) {
        return
      }
      const keyToStore = state[config.key]
      if (keyToStore === undefined) {
        return
      }
      if (event === '@init') {
        return
      }
      try {
        const saveState = serialize({ [key]: keyToStore })
        localStorage.setItem('storeon', saveState)
      } catch (err) {
        console.error(err)
      }
    })
  }
}

