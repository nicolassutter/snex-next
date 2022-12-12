import type { JSX } from 'preact'

export async function makePromise<T extends (...args: any[]) => Promise<any>>(
  cb: T,
) {
  return cb()
}

export function classesInAttrs(attrs?: JSX.HTMLAttributes<any>) {
  return classnames(attrs?.class, attrs?.className)
}
