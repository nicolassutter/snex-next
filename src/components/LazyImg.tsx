import { classesInAttrs } from '#src/utils/index'
import type { JSX, FunctionComponent } from 'preact'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface Props {
  src: string
  alt?: string
  imgAttrs?: Omit<JSX.HTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
  loaderAttrs?: JSX.HTMLAttributes<HTMLSpanElement>
  className?: string
}

export const LazyImg: FunctionComponent<Props> = ({
  src,
  alt,
  imgAttrs,
  loaderAttrs,
  className,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className={clsx('relative lazy-img', className)}>
      {!hasLoaded && (
        <span
          {...loaderAttrs}
          className={clsx(
            classesInAttrs(loaderAttrs),
            'absolute z-10 w-full h-full flex items-center justify-center bg-base-200',
          )}
        >
          <svg
            className='animate-spin h-5 w-5 text-info'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </span>
      )}

      <LazyLoadImage
        src={src}
        alt={alt}
        draggable={false}
        afterLoad={() => setHasLoaded(true)}
        onError={() => {
          setIsVisible(false)
        }}
        className={clsx(classesInAttrs(imgAttrs), 'relative z-20', {
          'opacity-0': !isVisible,
        })}
      ></LazyLoadImage>
    </div>
  )
}
