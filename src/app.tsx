import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { NavBar } from './components/NavBar'
import './app.css'

export function App() {
  return (
    <>
      <NavBar></NavBar>
      <main role="main">{useRoutes(routes)}</main>
    </>
  )
}
