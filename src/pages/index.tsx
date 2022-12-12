import type { Movie } from '#types'
import { PosterCard } from '#src/components/PosterCard'
import { api } from '#src/modules/api'
import { makePromise } from '#src/utils/index'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

function Index() {
  const results = useSignal([
    {
      key: 'top_rated',
      label: 'Top rated movies',
      items: [] as Movie[],
    } as const,
    {
      key: 'popular',
      label: 'Popular movies',
      items: [] as Movie[],
    } as const,
  ])

  function updateResults(key: string, newValue: Movie[]) {
    const resultIndex = results.value.findIndex((res) => res.key === key)

    if (resultIndex !== -1) {
      const resultsCopy = JSON.parse(JSON.stringify(results.value))
      resultsCopy[resultIndex].items = newValue
      results.value = resultsCopy
    }
  }

  useEffectOnce(() => {
    makePromise(async () => {
      const [popularResults, topResults] = await Promise.all([
        api.getPopularMovies(),
        api.getTopMovies(),
      ])

      updateResults('popular', popularResults.data?.results ?? [])
      updateResults('top_rated', topResults.data?.results ?? [])
    })
  })

  return (
    <div className='index-page p-2'>
      {results.value.map((result) => (
        <div
          className='banner mt-5 first:mt-0'
          key={result.key}
        >
          <h2 className='text-3xl font-bold'>{result.label}</h2>

          <Swiper
            spaceBetween={25}
            slidesPerView={7}
            className='mt-5'
          >
            {result.items.map((movie) => (
              <SwiperSlide
                key={movie.id}
                className='h-[unset] w-28'
              >
                <PosterCard
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className='h-full'
                  imgAttrs={{
                    className: 'h-full',
                  }}
                ></PosterCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  )
}

export default Index
