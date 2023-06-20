import { PosterCard } from '#src/components/PosterCard'
import { useStore } from '@nanostores/preact'
import {
  hasFetchedAtom,
  indexStore,
  populateIndexStore,
} from '#src/stores/indexStore'
import { useLocalStorage } from 'react-use'
import { Link } from 'react-router-dom'

function Index() {
  const [lastIndexFetchTime, setLastIndexFetchTime] = useLocalStorage(
    'last-index-fetch',
    new Date().getTime(),
  )

  const state = useStore(indexStore)
  const [isLoading, setIsLoading] = useState(true)

  const hasFetchedData = useStore(hasFetchedAtom)

  useEffectOnce(() => {
    const now = new Date().getTime()

    // 10 minutes in ms
    const minutesInMs = 10 * 60 * 1000

    /**
     * Fetches data only if it has been more than 10 minutes since last call
     * OR
     * If aby store is empty
     */
    if (
      (lastIndexFetchTime && now - lastIndexFetchTime > minutesInMs) ||
      hasFetchedData === false
    ) {
      populateIndexStore().finally(() => {
        hasFetchedAtom.set(true)
        setLastIndexFetchTime(new Date().getTime())
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  })

  return (
    <>
      <Helmet>
        <title>SNEX</title>
      </Helmet>

      <div className='index-page'>
        {!isLoading ? (
          <>
            {Object.entries(state).map(
              ([key, { items, label, category }]) =>
                items.length > 0 && (
                  <div
                    className='banner mt-10 first:mt-0'
                    key={key}
                  >
                    <h2 className='text-3xl font-bold'>{label}</h2>

                    <div className='overflow-x-auto w-full flex gap-2 min-h-12 mt-5'>
                      {items.map((item) =>
                        item.poster_path ? (
                          <div
                            key={item.id}
                            className={clsx(
                              'swiper-poster-slide shrink-0 grow-0',
                              'w-full xxs:w-1/2 sm:w-1/4 lg:w-1/5 2xl:w-1/6',
                            )}
                          >
                            <Link to={`/media/${category}/${item.id}`}>
                              <PosterCard
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                className='slider-poster-card poster-effect'
                                imgAttrs={{
                                  className: 'h-full',
                                }}
                                lazyClassName='h-full'
                              ></PosterCard>
                            </Link>
                          </div>
                        ) : undefined,
                      )}
                    </div>
                  </div>
                ),
            )}
          </>
        ) : (
          <>
            <p>Loading...</p>
          </>
        )}
      </div>
    </>
  )
}

export default Index
