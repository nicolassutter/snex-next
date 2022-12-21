import type { JSX } from 'preact'
import MarkdownIt from 'markdown-it'
import type { Movie, Person, Show } from '#types'

export async function makePromise<T extends (...args: any[]) => Promise<any>>(
  cb: T,
) {
  return cb()
}

export function isMovie(param: Movie | Show | Person): param is Movie {
  return (
    // A movie cannot have number_of_episodes
    !('number_of_episodes' in param) &&
    // Either media_type is not in param
    (!('media_type' in param) ||
      // Or media_type is defined and is 'movie'
      ('media_type' in param && param.media_type === 'movie'))
  )
}

export function isShow(param: Movie | Show | Person): param is Show {
  return (
    'number_of_episodes' in param ||
    ('media_type' in param && param.media_type === 'tv')
  )
}

export function isPerson(param: Movie | Show | Person): param is Person {
  return (
    'profile_path' in param ||
    ('media_type' in param && param.media_type === 'person')
  )
}

export function classesInAttrs(attrs?: JSX.HTMLAttributes<any>) {
  return clsx(attrs?.class, attrs?.className)
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
