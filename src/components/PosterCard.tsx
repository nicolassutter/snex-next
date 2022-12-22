import { classesInAttrs } from '#src/utils/index'
import type { JSX, FunctionComponent } from 'preact'
import { LazyImg } from './LazyImg'

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
  return (
    <div
      className={clsx(
        'poster-card relative aspect-[2/3] rounded-md',
        className,
      )}
    >
      <LazyImg
        loaderAttrs={{
          className: 'rounded-md',
        }}
        src={src}
        alt={alt}
        imgAttrs={{
          ...imgAttrs,
          className: clsx(
            classesInAttrs(imgAttrs),
            'aspect-[2/3] object-cover select-none rounded-md relative z-20',
          ),
        }}
      ></LazyImg>
    </div>
  )
}
