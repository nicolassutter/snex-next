import { api } from '#src/modules/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Mousewheel } from 'swiper'
import { getPosterPicture, getProfilePicture, md } from '#src/utils/index'
import type { Cast, MediaType, Movie, Show } from '#types'
import { useParams } from 'react-router'
import { PosterCard } from '#src/components/PosterCard'
import { Collapse } from '#src/components/Collapse'
import { Link } from 'react-router-dom'
import { sortBy, uniqBy } from 'lodash-es'

function isMediaType(param: unknown): param is MediaType {
  const mediaTypes = ['movie', 'tv'] satisfies MediaType[]
  // @ts-expect-error TS isn't happy, it's ok
  return mediaTypes.includes(param)
}

function Media() {
  const params = useParams()
  const media = useSignal<null | Movie | Show>(null)
  const isLoading = useSignal(true)

  const slug = params.slug

  const mediaType = slug?.split('_')?.at(0)
  const id = slug?.split('_')?.at(1)

  async function fetchData() {
    if (!isMediaType(mediaType) || !id) {
      return
    }

    try {
      isLoading.value = true
      const res = await api.getMedia({ type: mediaType, id })
      media.value = res
    } catch (error) {
      /* error */
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches the initial data + everytime the route changes
   */
  useEffectOnce(() => {
    fetchData()
  })

  /**
   * Data for the box containing "Directors", "Produces" and "Writers"
   */
  const crewMetaInfo = useComputed(() => {
    return [
      {
        name: 'Directors',
        items: uniqBy(
          media.value?.credits.crew.filter(
            (crewMember) => crewMember.department === 'Directing',
          ) ?? [],
          'id',
        ),
      },
      {
        name: 'Producers',
        items: uniqBy(
          media.value?.credits.crew.filter(
            (crewMember) => crewMember.department === 'Production',
          ) ?? [],
          'id',
        ),
      },
      {
        name: 'Writers',
        items: uniqBy(
          media.value?.credits.crew.filter(
            (crewMember) => crewMember.department === 'Writing',
          ) ?? [],
          'id',
        ),
      },
    ] as const
  })

  /**
   * Data for the sliders ("Recommended", "Similiar")
   */
  const sliders = useComputed(() => {
    return [
      {
        name: 'Recommended',
        items: media.value?.recommendations.results,
      },
      {
        name: 'Similar',
        items: media.value?.similar.results,
      },
    ] as const
  })

  const cover = useComputed(() => {
    return media.value?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${media.value.backdrop_path}`
      : ''
  })

  const thumbnail = useComputed(() =>
    media.value ? getPosterPicture(media.value) ?? '' : '',
  )

  const releaseYear = useComputed(() =>
    media.value ? new Date(media.value?.release_date).getFullYear() : undefined,
  )

  /**
   * The media runtime in human readable format
   */
  const runtime = useComputed(() => {
    if (!media.value) {
      return undefined
    }

    const minutes = media.value?.runtime
    const hours = Math.floor(minutes / 60)
    const leftoverMinutes = minutes % 60

    return `${hours}h${leftoverMinutes}m`
  })

  /**
   * Computes the profiles shown in the "People section"
   */
  const people = useComputed(() => {
    // Crew members sorted by highest popularity fist
    const crew = sortBy(
      media.value?.credits.crew.slice(0, 10) ?? [],
      (person) => person.popularity,
    ).reverse()

    // Cast members sorted by highest popularity fist
    const cast = sortBy(
      media.value?.credits.cast ?? [],
      (person) => person.popularity,
    ).reverse()

    // The crew people are always displayed first
    const _people = [...crew, ...cast].reduce((acc, person, _index) => {
      if (!person.profile_path) {
        return acc
      }

      // No duplicate persons (e.g a director also played a character)
      const alreadyPresentIndex = acc.findIndex(
        (originalPerson) => originalPerson.id === person.id,
      )

      const isPresent = alreadyPresentIndex > -1

      const isActor = Boolean(person.character)

      // We do not display uncredited persons
      const isUncreditedCharacter = Boolean(
        isActor && person.character?.includes('uncredited'),
      )

      if (!isPresent && !isUncreditedCharacter) {
        acc.push(person)
      } else if (!isActor) {
        // Fuse the duplicate's job with the one already present
        acc[
          alreadyPresentIndex
        ].job = `${acc[alreadyPresentIndex].job}, ${person.job}`
      }

      return acc
    }, [] as Cast[])

    return _people
  })

  return !isLoading.value ? (
    <div className='media-page w-full max-w-full col-center grid grid-cols-[300px_1fr] gap-5'>
      <PosterCard
        src={thumbnail.value}
        className='relative z-10'
      ></PosterCard>

      <div className='content-col w-full overflow-hidden relative p-5'>
        {JSON.stringify(params)}
        {/* cover image */}
        <img
          className='-z-10 absolute top-0 right-0 left-0 opacity-5 blur-sm'
          src={cover.value}
          alt=''
          aria-hidden={true}
        />

        <h1 className='font-bold text-4xl'>{media.value?.title}</h1>

        <div>
          {releaseYear.value} - {runtime.value}
        </div>

        <div className='genres mt-3 flex space-x-1 max-w-full overflow-x-auto'>
          {media.value?.genres.map((genre) => (
            <div
              key={`genre-${genre.id}`}
              className='genre badge badge-md badge-outline'
            >
              {genre.name}
            </div>
          ))}
        </div>

        <p
          className='mt-5 max-w-3xl'
          dangerouslySetInnerHTML={{
            __html: md.renderInline(media.value?.overview ?? ''),
          }}
        />

        <ul className='mt-5'>
          {crewMetaInfo.value.map((metaInfo) => (
            <li
              key={metaInfo.name}
              className='border-y-[1px] border-base-content flex py-2 first:border-b-0 last:border-t-0'
            >
              <span className='font-bold'>{metaInfo.name}:</span>
              <ul className='inline-flex ml-2 list-disc'>
                {metaInfo.items?.slice(0, 4).map((crewMember) => (
                  <li
                    className='mr-5 first:list-none'
                    key={`crew-member-${crewMember.id}-${metaInfo.name}`}
                  >
                    <Link
                      to='#'
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

        <h2 className='text-3xl font-bold mt-16'>People</h2>

        <Collapse
          maxHeight='500px'
          className='mt-5'
        >
          <ul className='people-list grid grid-cols-6 gap-5'>
            {people.value.map((person) => (
              <li
                className={`${person.id}`}
                key={`person-${person.id}-${person.department}`}
              >
                <img
                  src={getProfilePicture(person)}
                  className='rounded-md'
                  alt=''
                />
                <p>{person.name}</p>
                <p>{person.job ?? person.character}</p>
              </li>
            ))}
          </ul>
        </Collapse>

        {sliders.value.map((slider) =>
          // Display slider only if it has items
          slider.items?.length ? (
            <div key={`slider-${slider.name}`}>
              <h2 className='text-3xl font-bold mt-16'>{slider.name}</h2>

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
                  <SwiperSlide key={`recommendation-${sliderItem.id}`}>
                    <Link to={`/media/${mediaType}_${sliderItem.id}`}>
                      <PosterCard
                        src={getPosterPicture(sliderItem) as string}
                        className='slider-poster-card'
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
  )
}

export default Media
