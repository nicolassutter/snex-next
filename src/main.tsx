import 'preact/debug'
import { render } from 'preact'
import { BrowserRouter as Router } from 'react-router-dom'
import { App } from './app'

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app') as HTMLElement,
)
