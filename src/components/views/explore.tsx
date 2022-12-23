import { PosterCard } from '#src/components/PosterCard'
import { $fetch, api } from '#src/modules/api'
import { getPosterPicture, isValidSlug } from '#src/utils'
import type { MediaGenre, MediaType, Movie, Show, Slug } from '#types'
import { clamp } from 'lodash-es'
import { useLocation, useNavigate } from 'react-router'
import { Link, useSearchParams } from 'react-router-dom'
import IconPrev from '~icons/carbon/chevron-left'
import IconNext from '~icons/carbon/chevron-right'
import { Listbox } from '@headlessui/react'
import { Fragment } from 'preact/jsx-runtime'
import IconCheck from '~icons/carbon/checkmark'
import layout from '#src/assets/layout.module.css'

interface Props {
  mediaType: MediaType
  slug: Slug
}

function ExplorePage({ slug, mediaType }: Props) {
  const [searchParams] = useSearchParams()
  const loc = useLocation()
  const navigate = useNavigate()
  const [results, setResults] = useState<(Movie | Show)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [genresOptions, setGenresOptions] = useState<MediaGenre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<MediaGenre[]>([])

  // const genresInQuery =
  //   searchParams
  //     .get('genres')
  //     ?.split(',')
  //     .map((id) => parseInt(id)) ?? []

  const page = parseInt(searchParams.get('page') ?? '1')

  const prevPage = clamp(page - 1, 1, totalPages)
  const nextPage = clamp(page + 1, page, totalPages)

  async function fetchData(options: { page?: number } = {}) {
    setResults([])
    setIsLoading(true)
    setTotalPages(1)

    try {
      const url =
        isValidSlug(slug) && slug === 'discover'
          ? `/tmdb/discover/${mediaType}`
          : `/tmdb/${mediaType}/${slug}`

      const params: Record<string, any> = {
        page: options.page ?? page,
      }

      if (selectedGenres?.length && slug === 'discover') {
        params.with_genres = selectedGenres.map((genre) => genre.id).join(',')
      }

      const res = await $fetch<{
        results: (Movie | Show)[]
        total_pages: number
      }>(url, {
        params,
      })

      setTotalPages(res.total_pages)
      setResults(res.results)
    } catch (error) {
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    /**
     * If filters are available and they are not yet loaded
     */
    if (slug === 'discover' && !genresOptions.length) {
      // Do not await for faster page load
      mediaType === 'movie'
        ? api.getMovieGenres().then((res) => setGenresOptions(res))
        : api.getShowGenres().then((res) => setGenresOptions(res))
    }
  }, [page])

  return (
    <div className={clsx('search-page col-span-full', layout['layout-grid'])}>
      <h2 className='capitalize flex flex-center gap-2 text-3xl font-bold'>
        <span className='capitalize'>{mediaType}</span>
        <IconNext></IconNext>
        <span className='capitalize'>{slug.replaceAll('_', ' ')}</span>
      </h2>

      {genresOptions.length && slug === 'discover' ? (
        <form
          className='filters mt-5 flex gap-5'
          onSubmit={(event) => {
            event.preventDefault()

            /**
             * If page is not 1, the useEffect hook will fetch the data
             * ---
             * If page is 1, trigger manually
             */
            if (page !== 1) {
              navigate(`${loc.pathname}?page=1`)
            } else {
              fetchData()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              event.stopPropagation()
            }
          }}
        >
          <Listbox
            value={selectedGenres}
            onChange={setSelectedGenres}
            multiple
            by='id'
          >
            <div className='ui-dropdown'>
              <Listbox.Button className='max-w-52 w-full truncate select select-bordered flex items-center'>
                Genres: {selectedGenres.length} selected
              </Listbox.Button>

              <Listbox.Options as={Fragment}>
                <ul className='ui-dropdown-panel max-h-72 overflow-y-auto'>
                  {genresOptions.map((genre) => (
                    <Listbox.Option
                      key={`genre-${genre.id}`}
                      value={genre}
                      as={Fragment}
                    >
                      {({
                        active,
                        selected,
                      }: {
                        active: boolean
                        selected: boolean
                      }) => (
                        <li
                          className={clsx('ui-dropdown-item', {
                            active,
                            selected,
                          })}
                        >
                          <span>{genre.name}</span>
                          {selected && (
                            <IconCheck className='ml-auto w-5 h-5 text-info'></IconCheck>
                          )}
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
                </ul>
              </Listbox.Options>
            </div>
          </Listbox>

          <button
            className='btn'
            type='submit'
          >
            Submit
          </button>
        </form>
      ) : undefined}

      {!isLoading && results.length ? (
        <>
          <ul className={clsx(`gap-5 mt-16`, layout['full-poster-grid'])}>
            {results.map((media) => (
              <li key={`media-${media.id}`}>
                <Link
                  to={`/media/${mediaType}/${media.id}`}
                  className='h-full w-full'
                >
                  <PosterCard
                    className='poster-effect'
                    src={getPosterPicture(media) as string}
                    lazyClassName='h-full'
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
              to={`${loc.pathname}?page=${prevPage}`}
              className='btn shadow-lg'
              aria-label='Go to previous page'
            >
              <IconPrev></IconPrev>
              <span className='text-lg ml-2'>{prevPage}</span>
            </Link>

            <span className='self-center text-lg'>{page}</span>

            <Link
              to={`${loc.pathname}?page=${nextPage}`}
              className='btn shadow-lg'
              arial-label='Go to next page'
            >
              <span className='text-lg mr-2'>{nextPage}</span>
              <IconNext></IconNext>
            </Link>
          </div>
        </>
      ) : undefined}

      {!isLoading && !results.length ? <p>No results found.</p> : undefined}

      {isLoading && <p>Loading...</p>}
    </div>
  )
}

export default ExplorePage
