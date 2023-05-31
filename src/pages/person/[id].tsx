import { api } from '#src/modules/api'
import { getPosterPicture, getProfilePicture, md } from '#src/utils/index'
import type { MediaType, Person as IPerson } from '#types'
import { useNavigate, useParams } from 'react-router'
import { PosterCard } from '#src/components/PosterCard'
import { Link } from 'react-router-dom'
import { format, differenceInYears } from 'date-fns'
import { uniqBy } from 'lodash-es'

function Person() {
  const params = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState<IPerson>()
  const [isLoading, setIsLoading] = useState(true)

  async function fetchData() {
    if (!params.id) {
      navigate('/')
      return
    }

    try {
      setIsLoading(true)
      const res = await api.getPerson(params.id)
      setPerson(res)
    } catch (error) {
      /* error */
    } finally {
      setIsLoading(false)
    }
  }

  const sliders = useMemo(() => {
    return [
      {
        name: 'Movies as a cast member',
        items: uniqBy(
          person?.movie_credits.cast.filter((credit) => credit.poster_path),
          'id',
        ),
        mediaType: 'movie' satisfies MediaType,
      },
      {
        name: 'Movies as a crew member',
        items: uniqBy(
          person?.movie_credits.crew.filter((credit) => credit.poster_path),
          'id',
        ),
        mediaType: 'movie' satisfies MediaType,
      },
      {
        name: 'Shows as a cast member',
        items: uniqBy(
          person?.tv_credits.cast.filter((credit) => credit.poster_path),
          'id',
        ),
        mediaType: 'tv' satisfies MediaType,
      },
      {
        name: 'Shows as a crew member',
        items: uniqBy(
          person?.tv_credits.crew.filter((credit) => credit.poster_path),
          'id',
        ),
        mediaType: 'tv' satisfies MediaType,
      },
    ] as const
  }, [person])

  /**
   * Data for the box containing "Date of birth", "Age"
   */
  const personInfo = useMemo(
    () =>
      [
        {
          name: 'Date of birth',
          value: person?.birthday
            ? format(new Date(person.birthday), 'PPP')
            : '-',
        },
        {
          name: 'Date of death',
          value: person?.deathday
            ? format(new Date(person.deathday), 'PPP')
            : '-',
        },
        /* eslint-disable */
        {
          name: 'Age',
          value: person
            ? person?.deathday === null
              ? differenceInYears(new Date(), new Date(person.birthday)) // Alive
              : differenceInYears(
                new Date(person.deathday),
                new Date(person.birthday),
              ) // Dead
            : '-',
        },
        /* eslint-enable */
      ] as const,
    [person],
  )

  /**
   * Fetches the initial data + everytime the route changes
   */
  useEffect(() => {
    fetchData()
  }, [params.id])

  return (
    <>
      <Helmet>
        <title>{isLoading ? `SNEX` : `${person?.name} | SNEX`}</title>
      </Helmet>

      {!isLoading && person ? (
        <div
          className='
            media-page w-full max-w-full col-center
            grid
            grid-cols-1
            md:grid-cols-[theme(spacing.48)_1fr]
            lg:grid-cols-[theme(spacing.72)_1fr]
            gap-5
          '
        >
          <PosterCard
            src={getProfilePicture(person) as string}
            className='relative z-10 max-w-max max-h-max'
          ></PosterCard>

          <div className='content-col w-full overflow-hidden relative p-5'>
            <h1 className='font-bold text-4xl'>{person.name}</h1>

            <div className='mt-3 flex space-x-1 max-w-full overflow-x-auto'>
              <div className='badge badge-md badge-outline'>
                {person.known_for_department}
              </div>
            </div>

            <div
              className='mt-5 max-w-3xl max-h-60 overflow-y-auto'
              dangerouslySetInnerHTML={{
                __html: md.render(person?.biography ?? ''),
              }}
            />

            {
              <ul className='mt-5'>
                {personInfo.map((info) => (
                  <li
                    key={info.name}
                    className='border-y-[1px] border-base-content flex py-2 first:border-b-0 last:border-t-0'
                  >
                    <span className='font-bold'>{info.name}:</span>
                    <span className='ml-2'>{info.value}</span>
                  </li>
                ))}
              </ul>
            }

            {sliders.map((slider) =>
              // Display slider only if it has items
              slider.items?.length ? (
                <div key={`slider-${slider.name}`}>
                  <h2 className='text-3xl font-bold mt-16'>{slider.name}</h2>

                  <div className='overflow-x-auto w-full flex gap-2 min-h-12 mt-5'>
                    {slider.items?.map((sliderItem) => (
                      <div
                        key={`recommendation-${sliderItem.id}`}
                        className={clsx(
                          'swiper-poster-slide shrink-0 grow-0',
                          'w-full xs:w-1/2 sm:w-1/4 lg:w-1/5',
                        )}
                      >
                        <Link
                          to={`/media/${slider.mediaType}/${sliderItem.id}`}
                        >
                          <PosterCard
                            src={getPosterPicture(sliderItem) as string}
                            className='slider-poster-card poster-effect'
                            lazyClassName='h-full'
                            imgAttrs={{
                              className: 'h-full',
                            }}
                          ></PosterCard>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : undefined,
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default Person
