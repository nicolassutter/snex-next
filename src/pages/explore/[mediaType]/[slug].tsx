import { isMediaType, isValidSlug } from '#src/utils'
import { capitalize } from 'lodash-es'
import { useNavigate, useParams } from 'react-router'
import ExplorePage from '#src/components/views/explore'

function Explore() {
  const params = useParams()
  const navigate = useNavigate()

  const mediaType = params.mediaType
  const slug = params.slug

  const componentCanMount = isMediaType(mediaType) && isValidSlug(slug)

  useMount(() => {
    if (!componentCanMount) {
      navigate('/')
      throw new Error('Wrong page requested')
    }
  })

  return (
    <>
      <Helmet>
        <title>
          Explore &gt; {capitalize(slug?.replaceAll('_', ' '))} &gt;{' '}
          {capitalize(mediaType)} | SNEX
        </title>
      </Helmet>

      {/* The component will remount every-time slug or mediaType changes */}
      {componentCanMount && (
        <ExplorePage
          mediaType={mediaType}
          slug={slug}
          key={[slug, mediaType].join('-')}
        ></ExplorePage>
      )}
    </>
  )
}

export default Explore
