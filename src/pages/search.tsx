import { PosterCard } from '#src/components/PosterCard'
import { api } from '#src/modules/api'
import { getPosterPicture, getProfilePicture, isPerson } from '#src/utils'
import type { SearchMovie, SearchShow, SearchPerson } from '#types'
import { useNavigate } from 'react-router'
import { Link, useSearchParams } from 'react-router-dom'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const navigate = useNavigate()
  const [results, setResults] = useState<
    (SearchMovie | SearchShow | SearchPerson)[]
  >([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  async function search() {
    setResults([])
    setHasSearched(false)
    setIsLoading(true)

    try {
      const res = await api.searchMedia(query as string)
      setResults(res)
      setHasSearched(true)
      console.log(res)
    } catch (error) {
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles the initial request + every time the search query changes
   */
  useEffect(() => {
    if (!query) {
      navigate('/')
      throw new Error('no query provided, redirecting...')
    }

    search()
  }, [query])

  return query ? (
    <div className='search-page'>
      {!isLoading && results.length && hasSearched ? (
        <ul className='grid grid-cols-6 gap-5'>
          {results.map((media) => (
            <li key={`media-${media.id}`}>
              <Link
                to={
                  isPerson(media)
                    ? `/person/${media.id}`
                    : `/media/${media.media_type}/${media.id}`
                }
                className='h-full w-full'
              >
                <PosterCard
                  className='poster-effect'
                  src={
                    isPerson(media)
                      ? (getProfilePicture(media) as string)
                      : (getPosterPicture(media) as string)
                  }
                  imgAttrs={{
                    className: 'h-full',
                  }}
                ></PosterCard>
              </Link>
            </li>
          ))}
        </ul>
      ) : undefined}

      {!isLoading && !results.length && hasSearched ? (
        <p>No results found.</p>
      ) : undefined}

      {isLoading && <p>Loading...</p>}
    </div>
  ) : (
    <></>
  )
}

export default Search
