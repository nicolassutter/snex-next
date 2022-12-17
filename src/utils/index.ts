import type { JSX } from 'preact'
import MarkdownIt from 'markdown-it'

export async function makePromise<T extends (...args: any[]) => Promise<any>>(
  cb: T,
) {
  return cb()
}

export function classesInAttrs(attrs?: JSX.HTMLAttributes<any>) {
  return classnames(attrs?.class, attrs?.className)
}

export function getProfilePicture<T extends { profile_path?: string | null }>(
  person: T,
) {
  return person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : undefined
}

export function getPosterPicture<T extends { poster_path?: string | null }>(
  item: T,
) {
  return item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : undefined
}

export const md = new MarkdownIt()
