import type { Release, SingleRelease } from '#types'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  items: Release[]
  className?: string
}

export function Releases({ items, className }: Props) {
  const [uid] = useState(uuidv4())
  const [sortingKey, _setSortingKey] = useState('date')
  const [reverseSort, setReverseSort] = useState(false)
  const [digitalOnly, setDigitalOnly] = useState(false)
  const [tableHeads] = useState([
    {
      key: 'country',
      title: 'Country',
      sortable: true,
    },
    {
      key: 'type',
      title: 'Type',
      sortable: true,
    },
    {
      key: 'date',
      title: 'Date',
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      sortable: false,
    },
  ] as const)
  const [types] = useState({
    3: 'Theater',
    4: 'Digital',
    5: 'Physical',
    6: 'TV',
  })
  /**
   * Takes releases and sorts them by date
   */
  const sortByDate = (a: SingleRelease, b: SingleRelease) => {
    return new Date(a.release_date) > new Date(b.release_date) ? 1 : 0
  }
  const isDigital = (release: SingleRelease) => release.type === 4
  /**
   * Takes releases and sorts them by date
   */
  const sortByType = (a: SingleRelease, b: SingleRelease) => {
    return a.type > b.type ? 1 : 0
  }
  /**
   * Takes releases and sorts them by date
   */
  const sortByCountry = (a: SingleRelease, b: SingleRelease) => {
    const Acountry = a.country as string
    const Bcountry = b.country as string
    return Acountry.localeCompare(Bcountry)
  }
  const setSortingKey = (key: string) => {
    if (key) {
      /**
       * If click on the same key, toogle reverse mode
       */
      if (key === sortingKey) {
        setReverseSort((val) => !val)
      }
      _setSortingKey(key)
    }
  }
  const releases = useMemo(() => {
    const _items = items
      .map(({ iso_3166_1, release_dates }) => {
        const _releases = release_dates.map((release) => {
          const today = new Date()
          const releaseDate = new Date(release.release_date)
          const _status = today.getTime() > releaseDate.getTime()

          const status = {
            value: _status,
            text: _status ? 'Released' : 'Unreleased',
          }

          const key =
            Object.keys(types).find((key) => key === String(release.type)) ||
            '3'

          const releaseType = (types as any)[key]

          const flag = `https://flagsapi.com/${iso_3166_1}/flat/64.png`

          return {
            ...release,
            country: iso_3166_1,
            date: release.release_date,
            releaseDate,
            status,
            releaseType,
            id: uuidv4(),
            flag,
          }
        })

        return _releases
      })
      .flat() as SingleRelease[]

    const sortedItems = _items
      .filter((item) => (digitalOnly ? isDigital(item) : true))
      .sort((a, b) => {
        switch (sortingKey) {
          case 'type':
            return sortByType(a, b)
          case 'country':
            return sortByCountry(a, b)
          default:
            return sortByDate(a, b)
        }
      })

    return reverseSort ? sortedItems.reverse() : sortedItems
  }, [items, types, digitalOnly, sortingKey, reverseSort])

  return (
    <div className={clsx('releases', className)}>
      <span className='flex items-center'>
        <input
          id={`digital-only-${uid}`}
          className='checkbox mr-2'
          checked={digitalOnly}
          onInput={({ currentTarget: { checked } }) => setDigitalOnly(checked)}
          type='checkbox'
        />

        <label htmlFor={`digital-only-${uid}`}>Digital releases only</label>
      </span>

      <div className='max-w-full overflow-x-auto mt-3'>
        <table className='w-full'>
          <tr>
            {tableHeads.map((option) => {
              const Tag = option.sortable ? 'button' : 'span'

              return (
                <th key={`head-${option.key}`}>
                  <Tag
                    className='flex items-baseline'
                    onClick={() => {
                      option.sortable && setSortingKey(option.key)
                    }}
                  >
                    {option.title}
                    {/* <chevron-up v-if="option.sortable" class="ml-3 transform" :class="{ 'rotate-180': !(reverseSort && sortingKey === option.key) }" /> */}
                  </Tag>
                </th>
              )
            })}
          </tr>

          {releases.map((release) => {
            return (
              <tr key={`release-${release.id}`}>
                <td>
                  <figure className='flex items-center'>
                    <img
                      src={release.flag}
                      alt={release.country}
                      className='w-6'
                    />

                    <figcaption className='ml-3'>{release.country}</figcaption>
                  </figure>
                </td>
                <td>{release.releaseType}</td>
                <td>{format(release.releaseDate, 'PPP')}</td>
                <td>
                  <span
                    className={clsx('', {
                      'text-success': release.status.value,
                      'text-error': !release.status.value,
                    })}
                  >
                    {release.status.text}
                  </span>
                </td>
              </tr>
            )
          })}
        </table>
      </div>
    </div>
  )
}
