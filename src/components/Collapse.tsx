import type { FunctionComponent } from 'preact'
import type { PropsWithChildren } from 'preact/compat'

interface Props {
  maxHeight: number
  className?: string
}

export const Collapse: FunctionComponent<PropsWithChildren<Props>> = ({
  className,
  children,
  maxHeight,
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const el = useRef<HTMLDivElement | null>(null)
  const mutation = useObserver(el)

  const isSmaller = mutation ? mutation.contentRect.height < maxHeight : true

  return (
    <div
      ref={el}
      className={clsx(
        'ui-collapse relative',
        {
          'ui-collapse-open': isOpened,
          'ui-collapse-close': !isOpened,
          'ui-collapse-hidden': isSmaller,
        },
        className,
      )}
    >
      <div
        className='ui-collapse-content overflow-hidden'
        style={{ maxHeight: isOpened ? 'unset' : `${maxHeight}px` }}
      >
        {children}
      </div>

      {/* Not shown if container is smaller than max size */}
      {!isSmaller && (
        <div className='absolute bottom-5 flex justify-center left-0 right-0 z-40 pointer-events-none'>
          <button
            className='btn pointer-events-auto'
            onClick={() => setIsOpened((val) => !val)}
          >
            {isOpened ? 'Close' : 'Expand'}
          </button>
        </div>
      )}
    </div>
  )
}
