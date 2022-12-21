import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { Menu } from '@headlessui/react'
import IconMenu from '~icons/carbon/overflow-menu-horizontal'
import { throttle } from 'lodash-es'

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
            className='text-3xl tracking-widest uppercase'
          >
            SNE<span className='text-blue-500'>X</span>
          </Link>
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
