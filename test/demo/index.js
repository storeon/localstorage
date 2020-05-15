let useCallback = require('react').useCallback
let Fragment = require('react').Fragment
let render = require('react-dom').render
let h = require('react').createElement
let { StoreContext, connectStoreon } = require('storeon/react')
let { createStoreon } = require('storeon')
let { storeonDevtools, storeonLogger } = require('storeon/devtools')

let { persistState } = require('../../')

function counter (store) {
  store.on('@init', () => {
    return { count: 0 }
  })
  store.on('inc', state => {
    return { count: state.count + 1 }
  })
}

function Tracker (props) {
  let hue = Math.round(255 * Math.random())
  let style = { backgroundColor: 'hsla(' + hue + ', 50%, 50%, 0.2)' }
  return h('div', { className: 'tracker', style }, props.value)
}

function Button (props) {
  let onClick = useCallback(() => {
    props.dispatch(props.event)
  })
  return h('button', { onClick }, props.text)
}

function ButtonClear () {
  let onClick = function () {
    localStorage.clear()
  }
  return h('button', { onClick }, 'Clear localStorage')
}

let Tracker1 = connectStoreon('count', props => {
  return h(Tracker, {
    value: 'Counter: ' + props.count
  })
})

let Button1 = connectStoreon(props => {
  return h(Button, {
    dispatch: props.dispatch,
    event: 'inc',
    text: 'Increase counter'
  })
})

function App () {
  return h(
    Fragment,
    null,
    h('div', null, 'After refresh the page the state should be same'),
    h(Tracker1),
    h('div', { className: 'buttons' }, h(Button1), h(ButtonClear))
  )
}

let store = createStoreon([
  counter,
  storeonLogger,
  persistState(),
  storeonDevtools()
])

render(
  h(StoreContext.Provider, { value: store }, h(App)),
  document.querySelector('main')
)
