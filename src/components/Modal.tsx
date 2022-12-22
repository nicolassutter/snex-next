import type { FunctionalComponent } from 'preact'
import { createPortal } from 'preact/compat'
import IconClose from '~icons/carbon/close'

export const Modal: FunctionalComponent<{
  id: string
  onClickOutside?: (event: MouseEvent) => void
  onClose?: () => void
  title?: JSX.Element
}> = (props) => {
  const modalRoot = document.querySelector('#modal-root') as HTMLDivElement
  const [classes, setClasses] = useState('')
  const el = useRef<HTMLDivElement | null>(null)

  /**
   * To force trigger transition on opacity
   */
  setTimeout(() => {
    setClasses('opacity-100')
  }, 100)

  useMount(() => {
    if (el.current) {
      el.current.focus()
    }

    document.body.classList.add('overflow-y-hidden')
  })

  useUnmount(() => {
    if (el.current) {
      el.current.focus()
    }

    document.body.classList.remove('overflow-y-hidden')
  })

  return createPortal(
    <div
      ref={el}
      tabIndex={-1}
      id={props.id}
      className={clsx('modal z-50 visible pointer-events-auto', classes)}
      onClick={(event) => {
        if (props.onClickOutside) {
          props.onClickOutside(event)
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && props.onClose) {
          props.onClose()
        }
      }}
    >
      <div
        className='modal-box max-w-2xl flex-col flex'
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <div className='modal-header flex'>
          <h2 className='font-bold text-3xl'>{props.title}</h2>

          <button
            className='btn btn-md ml-auto'
            onClick={() => {
              if (props.onClose) {
                props.onClose()
              }
            }}
          >
            <IconClose></IconClose>
          </button>
        </div>

        <div className='h-full overflow-y-auto mt-2'>{props.children}</div>
      </div>
    </div>,
    modalRoot,
  )
}
