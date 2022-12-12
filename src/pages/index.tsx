import type { Movie } from '#types'
import { PosterCard } from '#src/components/PosterCard'
import { api } from '#src/modules/api'
import { makePromise } from '#src/utils/index'

function Index() {
  const result = useSignal<Movie[]>([])

  useEffectOnce(() => {
    makePromise(async () => {
      const {
        data: { results },
      } = await api.getPopularMovies()

      result.value = results
    })
  })

  return (
    <div className='index-page'>
      {result.value.map((v) => (
        <PosterCard
          className=''
          key={v.id}
          src={`https://image.tmdb.org/t/p/w500${v.poster_path}`}
        ></PosterCard>
      ))}
    </div>
  )
}

export default Index
