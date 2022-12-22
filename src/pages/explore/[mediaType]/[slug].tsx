import { PosterCard } from '#src/components/PosterCard'
import { $fetch } from '#src/modules/api'
import { getPosterPicture, isMediaType } from '#src/utils'
import type { Movie, Show } from '#types'
import { capitalize, clamp } from 'lodash-es'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Link, useSearchParams } from 'react-router-dom'
import IconPrev from '~icons/carbon/chevron-left'
import IconNext from '~icons/carbon/chevron-right'

const isValidSlug = (
  slug: unknown,
): slug is 'popular' | 'top_rated' | 'discover' | 'upcoming' => {
  return ['popular', 'top_rated', 'discover', 'upcoming'].includes(slug as any)
}

function Explore() {
  const [searchParams] = useSearchParams()
  const loc = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState<(Movie | Show)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const page = parseInt(searchParams.get('page') ?? '1')
  const mediaType = params.mediaType
  const slug = params.slug

  async function fetchData() {
    setResults([])
    setIsLoading(true)

    try {
      const url =
        isValidSlug(slug) && slug === 'discover'
          ? `/tmdb/discover/${mediaType}`
          : `/tmdb/${mediaType}/${slug}`

      const res = await $fetch<{
        results: (Movie | Show)[]
        total_pages: number
      }>(url, {
        params: {
          page,
        },
      })

      setTotalPages(res.total_pages)
      setResults(res.results)
    } catch (error) {
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles the initial request + every time the params change
   */
  useEffect(() => {
    if (!isMediaType(mediaType) || !isValidSlug(slug)) {
      navigate('/')
      throw new Error('Wrong page requested')
    }

    fetchData()
  }, [slug, page, mediaType])

  return (
    <>
      <Helmet>
        <title>Explore - {capitalize(slug)} | SNEX</title>
      </Helmet>

      {slug && mediaType ? (
        <div className='search-page col-span-full layout-grid'>
          {!isLoading && results.length ? (
            <>
              <ul className='grid grid-cols-6 gap-5'>
                {results.map((media) => (
                  <li key={`media-${media.id}`}>
                    <Link
                      to={`/media/${mediaType}/${media.id}`}
                      className='h-full w-full'
                    >
                      <PosterCard
                        className='poster-effect'
                        src={getPosterPicture(media) as string}
                        imgAttrs={{
                          className: 'h-full',
                        }}
                      ></PosterCard>
                    </Link>
                  </li>
                ))}
              </ul>

              <div
                className={`
                  pagination flex justify-center gap-5 mt-5 sticky bottom-0 py-2 z-50 bg-base-300 bg-opacity-50
                  col-span-full max-w-sm rounded-md justify-self-center w-full backdrop-blur-md
                  mx-5
                `}
              >
                <Link
                  to={`${loc.pathname}?page=${clamp(page - 1, 1, totalPages)}`}
                  className='btn shadow-lg'
                  aria-label='Go to previous page'
                >
                  <IconPrev></IconPrev>
                </Link>

                <Link
                  to={`${loc.pathname}?page=${clamp(
                    page + 1,
                    page,
                    totalPages,
                  )}`}
                  className='btn shadow-lg'
                  arial-label='Go to next page'
                >
                  <IconNext></IconNext>
                </Link>
              </div>
            </>
          ) : undefined}

          {!isLoading && !results.length ? <p>No results found.</p> : undefined}

          {isLoading && <p>Loading...</p>}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Explore
