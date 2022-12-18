import type { FunctionComponent } from 'preact'
import type { PropsWithChildren } from 'preact/compat'

interface Props {
  maxHeight: string
  className?: string
}

export const Collapse: FunctionComponent<PropsWithChildren<Props>> = ({
  className,
  children,
  maxHeight,
}) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <div
      className={clsx(
        'ui-collapse relative',
        {
          'ui-collapse-open': isOpened,
          'ui-collapse-close': !isOpened,
        },
        className,
      )}
    >
      <div
        className='ui-collapse-content overflow-hidden'
        style={{ maxHeight: isOpened ? 'unset' : maxHeight }}
      >
        {children}
      </div>

      <div className='absolute bottom-5 flex justify-center left-0 right-0'>
        <button
          className='btn'
          onClick={() => setIsOpened((val) => !val)}
        >
          {isOpened ? 'Close' : 'Expand'}
        </button>
      </div>
    </div>
  )
}
