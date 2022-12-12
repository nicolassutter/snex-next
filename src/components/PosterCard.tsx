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
    <div className={classnames('poster-card', className)}>
      <img
        {...imgAttrs}
        className={classnames(classesInAttrs(imgAttrs), 'aspect-[2/3]')}
        src={src}
        alt={alt}
        loading='lazy'
      />
    </div>
  )
}
