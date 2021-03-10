let { createStoreon } = require('storeon')

let { persistState } = require('../')

afterEach(() => {
  localStorage.clear()
  jest.restoreAllMocks()
})

it('should update the localStorage', () => {
  let store = createStoreon([persistState()])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ b: 1 }))
})

it('should not update the sessionStorage', () => {
  let store = createStoreon([persistState()])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(sessionStorage.getItem('storeon')).toBeNull()
})

it('should update the sessionStorage', () => {
  let store = createStoreon([persistState(null, { storage: sessionStorage })])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toBeNull()
  expect(sessionStorage.getItem('storeon')).toEqual(JSON.stringify({ b: 1 }))
})

it('should update the localStorage only once, on @changed events', () => {
  let spy = jest.spyOn(JSON, 'stringify')

  let store = createStoreon([persistState()])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(spy).toHaveBeenCalledTimes(1)
})

it('should update the state after init', () => {
  let data = JSON.stringify({ a: 1, b: 2 })
  localStorage.setItem('storeon', data)

  let store = createStoreon([persistState()])

  expect(localStorage.getItem('storeon')).toEqual(data)
  expect(store.get()).toEqual({ a: 1, b: 2 })
})

it('should update the localStorage only white listed names', () => {
  let store = createStoreon([persistState(['a'])])

  store.on('test', () => {
    return { a: 1, b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should works with missed config key', () => {
  let store = createStoreon([persistState(['a'], {})])

  store.on('test', () => {
    return { a: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should hande non jsonable object in localStorage', () => {
  localStorage.setItem('storeon', 'test string')

  let store = createStoreon([persistState()])

  expect(store.get()).toEqual({})
})

it('should handle non jsonable object in state', () => {
  let mock = jest.spyOn(JSON, 'stringify').mockImplementation(() => {
    throw Error('mock error')
  })
  let store = createStoreon([persistState(['a'])])

  store.on('test', () => {
    return { a: 1 }
  })
  store.dispatch('test')

  expect(mock).toHaveBeenCalledTimes(1)
  expect(store.get()).toEqual({ a: 1 })
})

it('should not process @dispatch before @init', () => {
  localStorage.setItem('storeon', JSON.stringify({ a: 'foo' }))

  let store = createStoreon([
    // This module tries to trigger a save in the local storage module
    function (s) {
      s.on('@init', () => {
        s.dispatch('foo')
      })
    },

    persistState(['a'])
  ])

  // If a save was triggered by the first module, the state would now be blank
  expect(store.get()).toEqual({ a: 'foo' })
})

let asyncStorage = () => {
  let s = {}
  return {
    setItem: (key, value) => {
      return new Promise(resolve => {
        s[key] = value
        resolve(value)
      })
    },
    getItem: key => {
      return new Promise(resolve => {
        resolve(s[key])
      })
    }
  }
}

it('should handle store if it return Promise', async () => {
  let storage = asyncStorage()
  let store = createStoreon([
    persistState(undefined, {
      storage
    })
  ])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(await storage.getItem('storeon')).toEqual(JSON.stringify({ b: 1 }))
})

it('should update the state after init with Promise', async () => {
  let data = JSON.stringify({ a: 1, b: 2 })
  let storage = asyncStorage()

  await storage.setItem('storeon', data)

  let store = createStoreon([
    persistState(undefined, {
      storage
    })
  ])

  expect(await storage.getItem('storeon')).toEqual(data)
  expect(store.get()).toEqual({ a: 1, b: 2 })
})

it('should support RegExp path', () => {
  let store = createStoreon([persistState([/^save-[a-z]/])])
  store.on('test', () => {
    return { 'save-b': 1, 'b': 2 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(
    JSON.stringify({
      'save-b': 1
    })
  )
})

it('should return nothing if there is no window', () => {
  jest.spyOn(global, 'window', 'get').mockImplementation(() => undefined)
  expect(window).toBeUndefined()

  let store = createStoreon([persistState()])

  expect(store.get()).toEqual({})
})

it('should take custom serializer function and call it', () => {
  let serializer = jest.fn()

  let store = createStoreon([
    persistState(undefined, {
      serializer
    })
  ])

  store.on('test', () => {
    return { a: 1 }
  })
  store.dispatch('test')

  expect(serializer).toHaveBeenCalledWith(store.get())
})

it('should take custom deserializer function and call it', () => {
  let deserializer = jest.fn()

  let data = JSON.stringify({ a: 1, b: 2 })
  localStorage.setItem('storeon', data)

  let persistedState = localStorage.getItem('storeon')

  createStoreon([
    persistState(undefined, {
      deserializer
    })
  ])

  expect(deserializer).toHaveBeenCalledWith(persistedState)
})
