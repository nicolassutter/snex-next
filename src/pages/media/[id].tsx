import { api } from '#src/modules/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Mousewheel } from 'swiper'
import {
  getPosterPicture,
  getProfilePicture,
  isMovie,
  isShow,
  md,
} from '#src/utils/index'
import type { ImdbData, Movie, Show } from '#types'
import { useNavigate, useParams } from 'react-router'
import { PosterCard } from '#src/components/PosterCard'
import { Collapse } from '#src/components/Collapse'
import { Releases } from '#src/components/Releases'
import { Link } from 'react-router-dom'

function Media() {
  const params = useParams()
  const navigate = useNavigate()
  const [media, setMedia] = useState<null | Movie | Show>()
  const [imdbData, setImdbData] = useState<ImdbData>()
  const [isLoading, setIsLoading] = useState(true)
  const arrPaths = useArrPaths(media)
  const crewMetaInfo = useMediaCrew(media)
  const { videosData } = useMediaVideos(media)
  const people = useMediaPeople(media)
  const mediaType = useMediaType()

  /**
   * Data for the sliders ("Recommended", "Similar")
   */
  const sliders = useMemo(() => {
    return [
      {
        name: 'Recommended',
        items: media?.recommendations.results,
      },
      {
        name: 'Similar',
        items: media?.similar.results,
      },
    ] as const
  }, [media])

  const cover = media?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}`
    : ''

  const thumbnail = media ? getPosterPicture(media) ?? '' : ''

  /**
   * Parses a number of minutes into a human readable format
   */
  function minutesToHuman(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const leftoverMinutes = minutes % 60

    return hours > 0 ? `${hours}h${leftoverMinutes}m` : `${leftoverMinutes}m`
  }

  async function fetchData() {
    if (!params.id) {
      navigate('/')
      return
    }

    try {
      setIsLoading(true)
      const res = await api.getMedia({ type: mediaType, id: params.id })

      // We do not await to avoid blocking users
      if (res.external_ids.imdb_id) {
        api
          .getImdbInfo(res.external_ids.imdb_id)
          .then((data) => setImdbData(data))
      }

      setMedia(res)
    } catch (error) {
      /* error */
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetches the initial data + everytime the route changes
   */
  useEffect(() => {
    fetchData()
  }, [params.id])

  return (
    <>
      <Helmet>
        <title>
          {isLoading ? `SNEX` : `${media?.title ?? media?.name} | SNEX`}
        </title>
      </Helmet>

      {!isLoading && media ? (
        <div className='media-page w-full max-w-full col-center grid grid-cols-[300px_1fr] gap-5'>
          <PosterCard
            src={thumbnail}
            className='relative z-10'
          ></PosterCard>

          <div className='content-col w-full overflow-hidden relative p-5'>
            {/* cover image */}
            <img
              className='-z-10 absolute top-0 right-0 left-0 opacity-5 blur-sm w-full'
              src={cover}
              alt=''
              aria-hidden={true}
            />

            <h1 className='font-bold text-4xl'>
              {media?.title ?? media?.name}
            </h1>

            <div className='base-media-info'>
              <ul className='list-disc flex space-x-5'>
                {/* year */}
                <li className='list-none'>
                  {isMovie(media) && new Date(media.release_date).getFullYear()}
                  {isShow(media) &&
                    new Date(media.first_air_date).getFullYear()}
                </li>

                {/* imdb score */}
                {imdbData?.score ? <li>{imdbData?.score}</li> : undefined}

                {/* runtime */}
                <li>
                  {isMovie(media) && minutesToHuman(media.runtime)}
                  {isShow(media) && (
                    <>
                      {media.episode_run_time.length > 1 ? (
                        // If there are multiple runtimes of episodes
                        <>
                          {minutesToHuman(Math.min(...media.episode_run_time))}-
                          {minutesToHuman(Math.max(...media.episode_run_time))}
                        </>
                      ) : (
                        // If every episode is the same runtime
                        <>{minutesToHuman(media.episode_run_time[0])}</>
                      )}
                    </>
                  )}
                </li>

                {/* seasons count */}
                {isShow(media) && media.number_of_seasons && (
                  <li>{media.number_of_seasons} seasons</li>
                )}

                {/* episodes count */}
                {isShow(media) && media.number_of_episodes && (
                  <li>{media.number_of_episodes} episodes</li>
                )}
              </ul>
            </div>

            <div className='genres mt-3 flex space-x-1 max-w-full overflow-x-auto'>
              {media?.genres.map((genre) => (
                <div
                  key={`genre-${genre.id}`}
                  className='genre badge badge-md badge-outline'
                >
                  {genre.name}
                </div>
              ))}
            </div>

            <div
              className='mt-5 max-w-3xl'
              dangerouslySetInnerHTML={{
                __html: md.render(media?.overview ?? ''),
              }}
            />

            <ul className='mt-5'>
              {crewMetaInfo.map((metaInfo) => (
                <li
                  key={metaInfo.name}
                  className='border-y-[1px] border-base-content flex py-2 first:border-b-0 last:border-t-0'
                >
                  <span className='font-bold'>{metaInfo.name}:</span>

                  <ul className='inline-flex ml-2 list-disc'>
                    {metaInfo.items.length === 0 && <>-</>}

                    {metaInfo.items?.slice(0, 4).map((crewMember) => (
                      <li
                        className='mr-5 first:list-none'
                        key={`crew-member-${crewMember.id}-${metaInfo.name}`}
                      >
                        <Link
                          to={`/person/${crewMember.id}`}
                          className='link link-info'
                        >
                          {crewMember.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {arrPaths.radarr.path || arrPaths.sonarr.path ? (
              <a
                className='btn mt-5'
                target='_blank'
                href={
                  isShow(media) ? arrPaths.sonarr.path : arrPaths.radarr.path
                }
                rel='noreferrer'
              >
                <img
                  src={
                    isShow(media) ? arrPaths.sonarr.logo : arrPaths.radarr.logo
                  }
                  alt=''
                  className='w-5 mr-1'
                />
                {isShow(media) ? 'Add to Sonarr' : 'Add to Radarr'}
              </a>
            ) : undefined}

            {isMovie(media) && media.release_dates?.results?.length ? (
              <Collapse
                maxHeight={250}
                className='mt-5'
              >
                <Releases items={media.release_dates.results}></Releases>
              </Collapse>
            ) : undefined}

            <h2 className='section-title mt-16'>People</h2>

            <Collapse
              maxHeight={500}
              className='mt-5'
            >
              <ul className='people-list grid grid-cols-6 gap-5'>
                {people.map((person) => (
                  <li
                    className={`${person.id}`}
                    key={`person-${person.id}-${person.department}`}
                  >
                    <Link to={`/person/${person.id}`}>
                      <img
                        src={getProfilePicture(person)}
                        className='rounded-md'
                        alt=''
                      />
                      <p>{person.name}</p>
                      <p>{person.job ?? person.character}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Collapse>

            {videosData.map(({ name, items }) =>
              items?.length ? (
                <>
                  <h2 className='section-title mt-16'>{name}</h2>

                  <Collapse
                    maxHeight={500}
                    className='mt-5'
                  >
                    <ul className='trailers-list grid grid-cols-3 gap-5'>
                      {items.map((video) => (
                        <li key={`video-${video.id}`}>
                          <iframe
                            className='w-full aspect-video rounded-lg'
                            src={`https://www.youtube.com/embed/${video.key}`}
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            loading='lazy'
                          />
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </>
              ) : undefined,
            )}

            {sliders.map((slider) =>
              // Display slider only if it has items
              slider.items?.length ? (
                <div key={`slider-${slider.name}`}>
                  <h2 className='section-title mt-16'>{slider.name}</h2>

                  <Swiper
                    modules={[A11y, Mousewheel]}
                    spaceBetween={15}
                    className='mt-5'
                    mousewheel={{
                      enabled: true,
                      forceToAxis: true,
                    }}
                    breakpoints={{
                      0: { slidesPerView: 1 },
                      // when window width is >= 320px
                      320: { slidesPerView: 2 },
                      // when window width is >= 640px
                      640: { slidesPerView: 4 },
                      // when window width is >= 768px
                      768: { slidesPerView: 5 },
                      // when window width is >= 1024px
                      1024: { slidesPerView: 6 },
                    }}
                  >
                    {slider.items?.map((sliderItem) => (
                      <SwiperSlide
                        key={`recommendation-${sliderItem.id}`}
                        className='swiper-poster-slide'
                      >
                        <Link to={`/media/${mediaType}/${sliderItem.id}`}>
                          <PosterCard
                            src={getPosterPicture(sliderItem) as string}
                            className='slider-poster-card poster-effect'
                            imgAttrs={{
                              className: 'h-full',
                            }}
                          ></PosterCard>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
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

export default Media
