import { classesInAttrs } from '#src/utils/index'
import type { JSX, FunctionComponent } from 'preact'

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
    <div className={clsx('poster-card', className)}>
      <img
        {...imgAttrs}
        className={clsx(
          classesInAttrs(imgAttrs),
          'aspect-[2/3] object-cover select-none rounded-md',
        )}
        src={src}
        alt={alt}
        draggable={false}
        loading='lazy'
      />
    </div>
  )
}
