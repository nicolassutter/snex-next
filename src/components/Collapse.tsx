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
  const isOpened = useSignal(false)

  return (
    <div
      className={classnames(
        'ui-collapse relative',
        {
          'ui-collapse-open': isOpened.value,
          'ui-collapse-close': !isOpened.value,
        },
        className,
      )}
    >
      <div
        className='ui-collapse-content overflow-hidden'
        style={{ maxHeight: isOpened.value ? 'unset' : maxHeight }}
      >
        {children}
      </div>

      <div className='absolute bottom-5 flex justify-center left-0 right-0'>
        <button
          className='btn'
          onClick={() => (isOpened.value = !isOpened.value)}
        >
          {isOpened.value ? 'Close' : 'Expand'}
        </button>
      </div>
    </div>
  )
}
