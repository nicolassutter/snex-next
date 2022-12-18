import { useRoutes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import './app.css'
import 'swiper/css'
import { Suspense } from 'preact/compat'

import Index from './pages'
import Media from './pages/media/[slug]'

export function App() {
  return (
    <div className='layout-grid'>
      <NavBar className='col-span-full sticky top-0 z-50'></NavBar>

      <main
        role='main'
        className='col-span-full layout-grid mt-5'
      >
        <Suspense fallback={<></>}>
          {useRoutes([
            {
              path: '/',
              element: <Index></Index>,
            },
            {
              path: '/media',
              children: [
                {
                  path: tvRoutePatten,
                  element: <Media></Media>,
                },
                {
                  path: movieRoutePatten,
                  element: <Media></Media>,
                },
              ],
            },
          ])}
        </Suspense>
      </main>
    </div>
  )
}
