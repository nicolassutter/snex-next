import { api } from '#src/modules/api'
import { getStillPicture, md } from '#src/utils'
import type { Season as ISeason } from '#types'
import { format } from 'date-fns'

interface Props {
  season: ISeason
  showId: string | number
  onError?: (err: unknown) => void
}

export function Season({ season, showId, onError }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [fullSeason, setFullSeason] = useState<ISeason>()

  async function fetchData() {
    setIsLoading(true)

    try {
      const res = await api.getSeason({
        seasonNumber: season.season_number,
        showId,
      })
      setFullSeason(res)
    } catch (error) {
      onError && onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useMount(() => {
    fetchData()
  })

  return (
    <div className='season'>
      {!isLoading ? (
        <ul className='grid grid-cols-[minmax(0,250px),auto] gap-4'>
          {fullSeason?.episodes?.map((episode) => {
            return (
              <li
                key={`season-${season.id}-episode-${episode.id}`}
                className='contents'
              >
                {/* Make sure to add a background if the image doesn't load or if there is no image */}
                <div className='rounded-md aspect-video bg-base-200 overflow-hidden'>
                  <img
                    src={getStillPicture(episode) as string}
                    alt=''
                    className='w-full'
                  />
                </div>

                <div>
                  <h3 className='font-bold text-lg'>
                    {episode.episode_number}. {episode.name}
                  </h3>

                  {episode.air_date && (
                    <p className='mt-2 text-sm'>
                      {format(new Date(episode.air_date), 'PPP')}
                    </p>
                  )}

                  <div
                    className='mt-2'
                    dangerouslySetInnerHTML={{
                      __html: md.render(episode?.overview ?? ''),
                    }}
                  ></div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
