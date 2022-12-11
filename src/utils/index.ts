import { omit } from 'lodash-es'
import type { JSX } from 'preact'

/**
 * Simple function to merge attributes and classes
 *
 * @example <img {...attrsWithClasses(attrs, 'custom-class')} />
 */
export function attrsWithClasses<
  T extends Partial<JSX.HTMLAttributes<any>> | undefined,
>(attrs: T, customClasses?: string) {
  const classes = classnames(
    attrs?.class ?? '',
    attrs?.className ?? '',
    customClasses,
  )

  return {
    ...omit(attrs, 'class', 'className'),
    className: classes,
  }
}
