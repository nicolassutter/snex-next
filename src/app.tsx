import { useRoutes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import './app.css'
import 'swiper/css'
import { Suspense } from 'preact/compat'

import Index from './pages'
import Media from './pages/media/[id]'
import Person from './pages/person/[id]'
import Search from './pages/search'
import Settings from './pages/settings'
import Explore from './pages/explore/[mediaType]/[slug]'
import layout from '#src/assets/layout.module.css'

export function App() {
  return (
    <>
      <div className={layout['layout-grid']}>
        <NavBar className='col-span-full sticky top-0 z-50'></NavBar>

        <main
          role='main'
          className={clsx(
            'col-span-full layout-grid mt-5',
            layout['layout-grid'],
          )}
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
              {
                // /explore/{movie,tv}/{popular,discover,top_rated}
                // accepts a `page` query param
                path: '/explore/:mediaType/:slug',
                element: <Explore></Explore>,
              },
              {
                path: '/person/:id',
                element: <Person></Person>,
              },
              {
                // `q` query param for search
                path: '/search',
                element: <Search></Search>,
              },
              {
                path: '/settings',
                element: <Settings></Settings>,
              },
            ])}
          </Suspense>
        </main>
      </div>
    </>
  )
}
