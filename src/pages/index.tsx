import type { Movie } from '../../types'
import { PosterCard } from '../components/PosterCard'
import { api } from '../modules/api'

function Index() {
  const result = useSignal<Movie[]>([])

  useEffectOnce(async () => {
    const {
      data: { results },
    } = await api.getPopularMovies()

    result.value = results
  })

  return (
    <div className='index-page'>
      {result.value.map((v) => (
        <PosterCard
          key={v.id}
          src={v.poster_path}
          imgAttrs={{
            className: 'hello',
          }}
        ></PosterCard>
      ))}
    </div>
  )
}

export default Index
