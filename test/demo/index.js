var useCallback = require('react').useCallback
var Fragment = require('react').Fragment
var render = require('react-dom').render
var h = require('react').createElement
var StoreContext = require('storeon/react/context')
var createStore = require('storeon')
var devtools = require('storeon/devtools')
var connect = require('storeon/react/connect')
var logger = require('storeon/devtools/logger')

var persistState = require('../../')

function counter (store) {
  store.on('@init', function () {
    return { count: 0 }
  })
  store.on('inc', function (state) {
    return { count: state.count + 1 }
  })
}

function Tracker (props) {
  var hue = Math.round(255 * Math.random())
  var style = { backgroundColor: 'hsla(' + hue + ', 50%, 50%, 0.2)' }
  return h('div', { className: 'tracker', style: style }, props.value)
}

function Button (props) {
  var onClick = useCallback(function () {
    props.dispatch(props.event)
  })
  return h('button', { onClick: onClick }, props.text)
}

function ButtonClear () {
  var onClick = function () {
    localStorage.clear()
  }
  return h('button', { onClick: onClick }, 'Clear localStorage')
}

var Tracker1 = connect('count', function (props) {
  return h(Tracker, {
    value: 'Counter: ' + props.count
  })
})

var Button1 = connect(function (props) {
  return h(Button, {
    dispatch: props.dispatch, event: 'inc', text: 'Increase counter'
  })
})

function App () {
  return h(Fragment, null,
    h('div', null, 'After refresh the page the state should be same'),
    h(Tracker1),
    h('div', { className: 'buttons' },
      h(Button1),
      h(ButtonClear)
    )
  )
}

var store = createStore([counter, logger, persistState(), devtools()])

render(
  h(StoreContext.Provider, { value: store }, h(App)),
  document.querySelector('main')
)
