import { api } from '#src/modules/api'
import { makePromise } from '#src/utils/index'
import type { MediaType, Movie, Show } from '#types'
import { useNavigate, useParams } from 'react-router'

function isMediaType(param: unknown): param is MediaType {
  const mediaTypes = ['movie', 'tv'] satisfies MediaType[]
  // @ts-expect-error TS isn't happy, it's ok
  return mediaTypes.includes(param)
}

function Media() {
  const params = useParams()
  const navigate = useNavigate()
  const media = useSignal<null | Movie | Show>(null)

  const slug = params.slug

  if (!slug) {
    return navigate('/')
  }

  const mediaType = slug?.split('_')?.at(0)
  const id = slug?.split('_')?.at(1)

  if (!isMediaType(mediaType) || !id) {
    return navigate('/')
  }

  useEffectOnce(() => {
    makePromise(async () => {
      const res = await api.getMedia({ type: mediaType, id })
      media.value = res
    })
  })

  const cover = computed(() => {
    return media.value?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${media.value?.backdrop_path}`
      : ''
  })

  const thumbnail = computed(() => {
    return media.value?.poster_path
      ? `https://image.tmdb.org/t/p/w500${media.value?.poster_path}`
      : ''
  })

  return (
    <div className='media-page grid grid-cols-[300px_1fr] gap-5'>
      <div>
        <img
          src={thumbnail}
          alt=''
        />
      </div>

      <img
        src={cover}
        alt=''
      />
    </div>
  )
}

export default Media
