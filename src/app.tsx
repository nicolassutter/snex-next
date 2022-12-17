import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { NavBar } from './components/NavBar'
import './app.css'
import 'swiper/css'
import { Suspense } from 'preact/compat'

export function App() {
  return (
    <div className='layout-grid'>
      <NavBar className='col-span-full sticky top-0 z-50'></NavBar>

      <main
        role='main'
        className='col-span-full layout-grid mt-5'
      >
        <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
      </main>
    </div>
  )
}
