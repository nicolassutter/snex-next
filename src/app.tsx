import { useRoutes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import './app.css'
import 'swiper/css'
import { Suspense } from 'preact/compat'

import layout from '#src/assets/layout.module.css'
import routes from '~react-pages'

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
          <Suspense fallback={<></>}>{useRoutes(routes)}</Suspense>
        </main>
      </div>
    </>
  )
}
