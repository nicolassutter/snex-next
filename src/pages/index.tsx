import { PosterCard } from '#src/components/PosterCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Mousewheel } from 'swiper'
import { useStore } from '@nanostores/preact'
import {
  hasFetchedAtom,
  indexStore,
  populateIndexStore,
} from '#src/stores/indexStore'
import { useLocalStorage } from 'react-use'
import { Link } from 'react-router-dom'

function Index() {
  const [lastIndexFetchTime, setLastIndexFetchTime] = useLocalStorage(
    'last-index-fetch',
    new Date().getTime(),
  )

  const state = useStore(indexStore)

  const hasFetchedData = useStore(hasFetchedAtom)

  useEffectOnce(() => {
    const now = new Date().getTime()

    // 10 minutes in ms
    const minutesInMs = 10 * 60 * 1000

    /**
     * Fetches data only if it has been more than 10 minutes since last call
     * OR
     * If aby store is empty
     */
    if (
      (lastIndexFetchTime && now - lastIndexFetchTime > minutesInMs) ||
      hasFetchedData === false
    ) {
      populateIndexStore().finally(() => {
        hasFetchedAtom.set(true)
        setLastIndexFetchTime(new Date().getTime())
      })
    }
  })

  return (
    <div className='index-page p-2'>
      {Object.entries(state).map(
        ([key, { items, label, category }]) =>
          items.length > 0 && (
            <div
              className='banner mt-10 first:mt-0'
              key={key}
            >
              <h2 className='text-3xl font-bold'>{label}</h2>

              <Swiper
                modules={[A11y, Mousewheel]}
                spaceBetween={15}
                className='mt-5'
                mousewheel={{
                  enabled: true,
                  forceToAxis: true,
                }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  // when window width is >= 320px
                  320: { slidesPerView: 2 },
                  // when window width is >= 640px
                  640: { slidesPerView: 4 },
                  // when window width is >= 768px
                  768: { slidesPerView: 5 },
                  // when window width is >= 1024px
                  1024: { slidesPerView: 6 },
                }}
              >
                {items.map((item) =>
                  item.poster_path ? (
                    <SwiperSlide
                      key={item.id}
                      className='h-[unset!important] w-28'
                    >
                      <Link to={`/media/${category}/${item.id}`}>
                        <PosterCard
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          className='slider-poster-card'
                          imgAttrs={{
                            className: 'h-full',
                          }}
                        ></PosterCard>
                      </Link>
                    </SwiperSlide>
                  ) : undefined,
                )}
              </Swiper>
            </div>
          ),
      )}
    </div>
  )
}

export default Index
