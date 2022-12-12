import { PosterCard } from '#src/components/PosterCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useStore } from '@nanostores/preact'
import {
  hasFetchedMoviesAtom,
  moviesStore,
  populateMoviesStore,
} from '#src/stores/moviesStore'
import { hasFetchedTvAtom, populateTvStore, tvStore } from '#src/stores/tvStore'
import { useLocalStorage } from 'react-use'

function Index() {
  const [lastIndexFetchTime, setLastIndexFetchTime] = useLocalStorage(
    'last-index-fetch',
    new Date().getTime(),
  )

  const moviesState = useStore(moviesStore)
  const showsState = useStore(tvStore)

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
      hasFetchedTvAtom.get() === false ||
      hasFetchedMoviesAtom.get() === false
    ) {
      populateMoviesStore()
      populateTvStore()
      setLastIndexFetchTime(new Date().getTime())
      hasFetchedTvAtom.set(true)
      hasFetchedMoviesAtom.set(true)
    }
  })

  const globalState = computed(() => {
    const _movies = Object.entries(moviesState).map(([key, value]) => ({
      ...value,
      key: `movies_${key}`,
    }))

    const _shows = Object.entries(showsState).map(([key, value]) => ({
      ...value,
      key: `shows_${key}`,
    }))

    return [..._movies, ..._shows]
  })

  return (
    <div className='index-page p-2'>
      {globalState.value.map(
        ({ key, items, label }) =>
          items.length > 0 && (
            <div
              className='banner mt-10 first:mt-0'
              key={key}
            >
              <h2 className='text-3xl font-bold'>{label}</h2>

              <Swiper
                spaceBetween={25}
                slidesPerView={7}
                className='mt-5'
              >
                {items.map((item) => (
                  <SwiperSlide
                    key={item.id}
                    className='h-[unset] w-28'
                  >
                    <PosterCard
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      className='h-full'
                      imgAttrs={{
                        className: 'h-full',
                      }}
                    ></PosterCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ),
      )}
    </div>
  )
}

export default Index
