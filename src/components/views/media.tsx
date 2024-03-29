import IconStar from '~icons/carbon/star-filled'
import { api } from '#src/modules/api'
import { v4 as uuid } from 'uuid'
import {
  getPosterPicture,
  getProfilePicture,
  isMovie,
  isSeason,
  isShow,
  md,
} from '#src/utils/index'
import type { ImdbData, Movie, Season as ISeason, Show, Video } from '#types'
import { useNavigate, useParams } from 'react-router'
import { PosterCard } from '#src/components/PosterCard'
import { Collapse } from '#src/components/Collapse'
import { Releases } from '#src/components/Releases'
import { LazyImg } from '#src/components/LazyImg'
import { Link } from 'react-router-dom'
import { Modal } from '#src/components/Modal'
import { Season } from '#src/components/Season'

function Media() {
  const params = useParams()
  const navigate = useNavigate()
  const [media, setMedia] = useState<null | Movie | Show>()
  const [currentSeason, setCurrentSeason] = useState<ISeason>()
  const [currentVideo, setCurrentVideo] = useState<Video>()
  const [imdbData, setImdbData] = useState<ImdbData>()
  const [isLoading, setIsLoading] = useState(true)
  const arrPaths = useArrPaths(media)
  const crewMetaInfo = useMediaCrew(media)
  const { videosData } = useMediaVideos(media)
  const people = useMediaPeople(media)
  const mediaType = useMediaType()

  const seasonModalUid = uuid()
  const videosModalUid = uuid()

  /**
   * Data for the sliders ("Recommended", "Similar")
   */
  const sliders = useMemo(() => {
    return [
      {
        name: `Seasons`,
        items: media && isShow(media) ? media.seasons : undefined,
      },
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

      {/* Season Modal */}
      {currentSeason && media?.id && (
        <Modal
          title={<>{currentSeason.name}</>}
          id={seasonModalUid}
          onClickOutside={() => setCurrentSeason(undefined)}
          onClose={() => setCurrentSeason(undefined)}
        >
          <Season
            showId={media?.id}
            season={currentSeason}
          ></Season>
        </Modal>
      )}

      {/* Video modal */}
      {currentVideo && media?.id && (
        <Modal
          title={<>{currentVideo.name}</>}
          id={videosModalUid}
          onClickOutside={() => setCurrentVideo(undefined)}
          onClose={() => setCurrentVideo(undefined)}
        >
          <iframe
            className='w-full aspect-video rounded-lg'
            src={`https://www.youtube.com/embed/${currentVideo.key}`}
            frameBorder='0'
            allow='accelerometer; autoplay; picture-in-picture'
            allowFullScreen
          />
        </Modal>
      )}

      {!isLoading && media ? (
        <div
          className={`
            media-page w-full max-w-full col-center grid gap-5
            grid-cols-1
            md:grid-cols-[theme(spacing.48)_1fr]
            lg:grid-cols-[theme(spacing.72)_1fr]
        `}
        >
          <PosterCard
            src={thumbnail}
            className='relative z-10 aspect-[unset] md:aspect-[2/3] max-w-48 md:max-w-[unset]'
          ></PosterCard>

          <div className='content-col w-full overflow-hidden relative md:p-5'>
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
                {imdbData?.score ? (
                  <li>
                    <span className='flex items-center'>
                      {imdbData?.score}
                      <IconStar className='ml-1 mt-[2px] w-3 grow-0 shrink-0' />
                    </span>
                  </li>
                ) : undefined}

                {/* runtime */}

                {media.runtime !== undefined ||
                (isShow(media) && media.episode_run_time.length > 0) ? (
                  <li>
                    {isMovie(media) &&
                      media.runtime !== undefined &&
                      minutesToHuman(media.runtime)}
                    {isShow(media) && (
                      <>
                        {media.episode_run_time.length > 1 ? (
                          // If there are multiple runtimes of episodes
                          <>
                            {minutesToHuman(
                              Math.min(...media.episode_run_time),
                            )}
                            -
                            {minutesToHuman(
                              Math.max(...media.episode_run_time),
                            )}
                          </>
                        ) : (
                          // If every episode is the same runtime
                          <>{minutesToHuman(media.episode_run_time[0])}</>
                        )}
                      </>
                    )}
                  </li>
                ) : undefined}

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

            <div className='mt-3 flex space-x-1 max-w-full overflow-x-auto'>
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

                  <ul className='inline-flex ml-2 list-disc max-w-full overflow-x-auto'>
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
              <Releases
                className='mt-5'
                items={media.release_dates.results}
              ></Releases>
            ) : undefined}

            {people.length > 0 && (
              <>
                {/* People grid */}
                <h2 className='section-title mt-16'>People</h2>

                <Collapse
                  maxHeight={500}
                  className='mt-5'
                >
                  <ul
                    className={`
                      people-list grid gap-5
                      grid-cols-2
                      sm:grid-cols-3
                      lg:grid-cols-4
                      xl:grid-cols-6
                  `}
                  >
                    {people.map((person) => (
                      <li
                        className={`${person.id}`}
                        key={`person-${person.id}-${person.department}`}
                      >
                        <Link
                          to={`/person/${person.id}`}
                          className='select-none'
                          draggable={false}
                        >
                          <LazyImg
                            className='w-full aspect-[2/3] rounded-md poster-effect'
                            src={getProfilePicture(person) as string}
                            imgAttrs={{
                              className: 'rounded-md h-full',
                            }}
                            loaderAttrs={{
                              className: 'rounded-md',
                            }}
                            alt=''
                          />
                          <p className='font-bold mt-1'>{person.name}</p>
                          <p>{person.job ?? person.character}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </>
            )}

            {videosData.map(({ name, items }) =>
              items?.length ? (
                <>
                  <h2 className='section-title mt-16'>{name}</h2>

                  <Collapse
                    maxHeight={500}
                    className='mt-5'
                  >
                    <ul
                      className={`
                        trailers-list grid gap-5
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-3
                      `}
                    >
                      {items.map((video) => (
                        <button
                          key={`video-${video.id}`}
                          className='poster-effect rounded-lg select-none'
                          onClick={() => setCurrentVideo(video)}
                          draggable={false}
                          aria-label={`View video "${video.name}"`}
                        >
                          <LazyImg
                            className='w-full aspect-video'
                            src={`https://i3.ytimg.com/vi/${video.key}/maxresdefault.jpg`}
                            imgAttrs={{
                              className: 'w-full h-full',
                            }}
                            alt=''
                          ></LazyImg>
                        </button>
                      ))}
                    </ul>
                  </Collapse>
                </>
              ) : undefined,
            )}

            {/* Reviews grid */}
            {imdbData?.reviews.length ? (
              <>
                <h2 className='section-title mt-16'>Reviews</h2>

                <Collapse
                  maxHeight={500}
                  className='mt-5'
                >
                  <ul
                    className={`
                      reviews-list grid gap-5
                      grid-cols-1
                      sm:grid-cols-2
                      xl:grid-cols-3
                  `}
                  >
                    {imdbData.reviews.map((review) => (
                      <li
                        className='card bg-base-200 shadow-md w-full'
                        key={`review-${review.author}-${review.title}`}
                      >
                        <div className='card-body'>
                          <h3 className='card-title'>
                            {review.author}
                            {review.rating || review.rating === 0 ? (
                              <span className='badge badge-info'>
                                {review.rating}
                                <IconStar className='ml-1 w-3 grow-0 shrink-0' />
                              </span>
                            ) : undefined}
                          </h3>
                          <div
                            className='mt-2 max-h-72 overflow-y-auto'
                            dangerouslySetInnerHTML={{
                              __html: md.render(
                                review.content?.replaceAll('<br>', '\n') ?? '',
                              ),
                            }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </>
            ) : undefined}

            {sliders.map((slider) =>
              // Display slider only if it has items
              slider.items?.length ? (
                <div key={`slider-${slider.name}`}>
                  <h2 className='section-title mt-16'>{slider.name}</h2>

                  <div className='overflow-x-auto w-full flex gap-2 min-h-12 mt-5'>
                    {slider.items?.map((sliderItem) => {
                      const Tag = slider.name === 'Seasons' ? 'button' : Link

                      const props = isSeason(sliderItem)
                        ? {
                            onClick: () => {
                              setCurrentSeason(sliderItem)
                            },
                          }
                        : {
                            to: `/media/${mediaType}/${sliderItem.id}`,
                          }

                      return (
                        <div
                          key={`slider-item-${sliderItem.id}`}
                          className={clsx(
                            'swiper-poster-slide shrink-0 grow-0',
                            'w-full xxs:w-1/2 sm:w-1/4 lg:w-1/5',
                          )}
                        >
                          <Tag
                            {...props}
                            className='w-full'
                          >
                            <PosterCard
                              src={getPosterPicture(sliderItem) as string}
                              className='slider-poster-card poster-effect'
                              lazyClassName='h-full'
                              imgAttrs={{
                                className: 'h-full',
                              }}
                            ></PosterCard>
                          </Tag>
                        </div>
                      )
                    })}
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

export default Media
