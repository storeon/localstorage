let createStore = require('storeon')

let persistState = require('../')

afterEach(() => {
  localStorage.clear()
  jest.restoreAllMocks()
})

it('should update the localStorage', () => {
  let store = createStore([
    persistState()
  ])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ b: 1 }))
})

it('should update the localStorage only once, on @changed events', () => {
  let spy = jest.spyOn(JSON, 'stringify')

  let store = createStore([persistState()])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(spy).toHaveBeenCalledTimes(1)
})

it('should update the state after init', () => {
  let data = JSON.stringify({ a: 1, b: 2 })
  localStorage.setItem('storeon', data)

  createStore([
    persistState()
  ])

  expect(localStorage.getItem('storeon')).toEqual(data)
})

it('should update the localStorage only white listed names', () => {
  let store = createStore([
    persistState(['a'])
  ])

  store.on('test', () => {
    return { a: 1, b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should works with missed config key', () => {
  let store = createStore([
    persistState(['a'], { })
  ])

  store.on('test', () => {
    return { a: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should hande non jsonable object in localStorage', () => {
  localStorage.setItem('storeon', 'test string')

  let store = createStore([
    persistState()
  ])

  expect(store.get()).toEqual({})
})

it('should handle non jsonable object in state', () => {
  jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
    throw Error('mock error')
  })
  let store = createStore([
    persistState(['a'])
  ])

  store.on('test', () => {
    return 'nonce'
  })

  expect(store.get()).toEqual({})
})

it('should not process @dispatch before @init', () => {
  localStorage.setItem('storeon', JSON.stringify({ a: 'foo' }))

  let store = createStore([
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

it('should support RegExp path', () => {
  let store = createStore([
    persistState([/^save-[a-z]/])
  ])
  store.on('test', () => {
    return { 'save-b': 1, 'b': 2 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({
    'save-b': 1
  }))
})
