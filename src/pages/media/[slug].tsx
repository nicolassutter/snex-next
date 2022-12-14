import { api } from '#src/modules/api'
import { makePromise } from '#src/utils/index'
import type { MediaType } from '#types'
import { useNavigate, useParams } from 'react-router'

function isMediaType(param: unknown): param is MediaType {
  const mediaTypes = ['movie', 'tv'] satisfies MediaType[]
  // @ts-expect-error TS isn't happy, it's ok
  return mediaTypes.includes(param)
}

function Media() {
  const params = useParams()
  const navigate = useNavigate()

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
      console.log(res)
    })
  })

  return <div className='media-page'></div>
}

export default Media
