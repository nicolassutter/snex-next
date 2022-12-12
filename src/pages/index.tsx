import type { Movie } from '#types'
import { PosterCard } from '#src/components/PosterCard'
import { api } from '#src/modules/api'
import { makePromise } from '#src/utils/index'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

function Index() {
  const results = useSignal({
    top_rated: [] as Movie[],
    popular: [] as Movie[],
  })

  useEffectOnce(() => {
    makePromise(async () => {
      const [popularResults, topResults] = await Promise.all([
        api.getPopularMovies(),
        api.getTopMovies(),
      ])

      results.value = {
        ...results.value,
        popular: popularResults.data?.results ?? [],
        top_rated: topResults.data?.results ?? [],
      }
    })
  })

  return (
    <div className='index-page p-2'>
      {Object.entries(results.value).map(([key, value]) => (
        <div
          className='banner mt-5 first:mt-0'
          key={key}
        >
          <h2 className='text-3xl font-bold'>{key}</h2>

          <Swiper
            spaceBetween={25}
            slidesPerView={7}
            className='mt-5'
          >
            {value.map((movie) => (
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
