import type { JSX, FunctionComponent } from 'preact'
import { attrsWithClasses } from '../utils'

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
        src={src}
        alt={alt}
        {...attrsWithClasses(imgAttrs, 'custom-class')}
      />
    </div>
  )
}
