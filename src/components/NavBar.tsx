import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { Menu } from '@headlessui/react'
import { throttle } from 'lodash-es'
import IconMenu from '~icons/carbon/overflow-menu-horizontal'
import IconChevronDown from '~icons/carbon/chevron-down'

interface Props {
  className?: string
}

export function NavBar({ className }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const [items] = useState([
    {
      _key: uuid(),
      title: 'Settings',
      to: '/settings',
    },
  ])

  const [scrollY, setScrollY] = useState(0)

  const [exploreItems] = useState([
    {
      name: 'Movie',
      items: [
        {
          title: 'Discover',
          to: `/explore/movie/discover`,
        },
        {
          title: 'Popular',
          to: `/explore/movie/popular`,
        },
        {
          title: 'Upcoming',
          to: `/explore/movie/upcoming`,
        },
        {
          title: 'Top rated',
          to: `/explore/movie/top_rated`,
        },
      ],
    },
    {
      name: 'TV',
      items: [
        {
          title: 'Discover',
          to: `/explore/tv/discover`,
        },
        {
          title: 'Popular',
          to: `/explore/tv/popular`,
        },
        {
          title: 'Top rated',
          to: `/explore/tv/top_rated`,
        },
      ],
    },
  ] as const)

  const onScroll = useCallback(
    throttle(() => {
      setScrollY(window.scrollY)
    }, 50),
    [],
  )

  function onSubmit(event: Event) {
    event.preventDefault()
    // Navigate to search
    navigate(`/search?q=${searchValue}`)
  }

  useMount(() => {
    window.addEventListener('scroll', onScroll)
  })

  useUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return (
    <nav
      className={clsx(
        'bg-base-100 layout-grid',
        { shadow: scrollY > 0 },
        className,
      )}
    >
      <div className='navbar p-0'>
        <div className='flex-1'>
          <Link
            to='/'
            className='text-3xl tracking-wide uppercase font-semibold'
          >
            SNE<span className='text-blue-500'>X</span>
          </Link>

          <div className='flex items-center ml-10'>
            {exploreItems.map((exploreItem) => {
              return (
                <Menu key={`explore-item-${exploreItem.name}`}>
                  {() => (
                    <div className='ui-dropdown'>
                      <Menu.Button className='btn btn-ghost btn-sm'>
                        {() => (
                          <>
                            {exploreItem.name}{' '}
                            <IconChevronDown className='ml-1'></IconChevronDown>
                          </>
                        )}
                      </Menu.Button>

                      <Menu.Items className='ui-dropdown-panel'>
                        {exploreItem.items.map((item) => (
                          <Menu.Item key={`movie-${item.title}`}>
                            {
                              // @ts-expect-error Seems like the lib isn't correctly typed
                              ({ active }) => (
                                <Link
                                  className={clsx('ui-dropdown-item', {
                                    active,
                                  })}
                                  to={item.to}
                                >
                                  {item.title}
                                </Link>
                              )
                            }
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </div>
                  )}
                </Menu>
              )
            })}
          </div>
        </div>

        <div className='flex-none gap-2'>
          <form
            className='form-control'
            onSubmit={onSubmit}
          >
            <input
              type='text'
              placeholder='Search'
              className='input input-bordered'
              onInput={(event) =>
                setSearchValue((event.target as HTMLInputElement).value)
              }
              value={searchValue}
            />
          </form>

          <div className='flex-none'>
            <Menu>
              {() => (
                <div className='ui-dropdown'>
                  <Menu.Button className='btn'>
                    {() => <IconMenu></IconMenu>}
                  </Menu.Button>

                  <Menu.Items className='ui-dropdown-panel right-0'>
                    {items.map((item) => (
                      <Menu.Item key={item._key}>
                        {
                          // @ts-expect-error Seems like the lib isn't correctly typed
                          ({ active }) => (
                            <Link
                              className={clsx('ui-dropdown-item', {
                                active,
                              })}
                              to={item.to}
                            >
                              {item.title}
                            </Link>
                          )
                        }
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </div>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}
