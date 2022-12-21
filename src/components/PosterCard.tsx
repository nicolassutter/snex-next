import { classesInAttrs } from '#src/utils/index'
import type { JSX, FunctionComponent } from 'preact'
import { useMount } from 'react-use'

interface Props {
  src: string
  alt?: string
  imgAttrs?: Omit<JSX.HTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
  className?: string
}

export const PosterCard: FunctionComponent<Props> = ({
  src,
  alt,
  imgAttrs,
  className,
}) => {
  const img = useRef<HTMLImageElement | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  /**
   * We only add the `src` to the image once the component is mounted
   * This will make `loading='lazy` work as expected
   */
  useMount(() => {
    setHasMounted(true)
  })

  return (
    <div
      className={clsx(
        'poster-card relative aspect-[2/3] rounded-md',
        className,
      )}
    >
      {!hasLoaded && (
        <span className='card-loader aspect-[2/3] absolute z-10 w-full rounded-md flex items-center justify-center bg-base-200'>
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

      <img
        ref={img}
        {...imgAttrs}
        className={clsx(
          classesInAttrs(imgAttrs),
          'aspect-[2/3] object-cover select-none rounded-md relative z-20',
        )}
        src={hasMounted ? src : undefined}
        alt={alt}
        draggable={false}
        onLoad={() => setHasLoaded(true)}
        loading='lazy'
      />
    </div>
  )
}
