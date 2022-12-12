import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { Menu } from '@headlessui/react'
import IconMenu from '~icons/carbon/overflow-menu-horizontal'

export function NavBar() {
  const items = useSignal([
    {
      _key: uuid(),
      title: 'Settings',
      to: '/settings',
    },
  ])

  return (
    <nav className='navbar bg-base-100'>
      <div className='flex-1'>
        <Link
          to='/'
          className='btn btn-ghost text-3xl tracking-widest uppercase'
        >
          SNE<span className='text-blue-500'>X</span>
        </Link>
      </div>

      <div className='flex-none gap-2'>
        <div className='form-control'>
          <input
            type='text'
            placeholder='Search'
            className='input input-bordered'
          />
        </div>

        <div className='flex-none'>
          <Menu>
            {({ open }: { open: boolean }) => (
              <div className='dropdown'>
                <Menu.Button className='btn'>
                  {() => <IconMenu></IconMenu>}
                </Menu.Button>

                {open && (
                  <ul className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 right-0'>
                    <Menu.Items>
                      {items.value.map((item) => (
                        <Menu.Item key={item._key}>
                          {() => (
                            <li>
                              <Link to={item.to}>{item.title}</Link>
                            </li>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </ul>
                )}
              </div>
            )}
          </Menu>
        </div>
      </div>
    </nav>
  )
}
