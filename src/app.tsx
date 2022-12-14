import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { NavBar } from './components/NavBar'
import './app.css'
import { Suspense } from 'preact/compat'

export function App() {
  return (
    <>
      <NavBar></NavBar>
      <main role='main'>
        <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
      </main>
    </>
  )
}
