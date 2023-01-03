import type { JSX } from 'preact'
import MarkdownIt from 'markdown-it'
import type { MediaType, Movie, Person, Season, Show, Slug } from '#types'
import { z } from 'zod'

const movieShape = z
  .object({
    // A movie has a runtime, shows and others do not
    runtime: z.number().nullable(),
  })
  .or(
    z.object({
      media_type: z.literal('movie'),
    }),
  )

const showShape = z
  .object({
    number_of_episodes: z.number(),
  })
  .or(
    z.object({
      media_type: z.literal('tv'),
    }),
  )

const seasonShape = z.object({
  season_number: z.number(),
  poster_path: z.string().nullable(),
  overview: z.string(),
})

const personShape = z
  .object({
    profile_path: z.string().nullable(),
  })
  .or(
    z.object({
      media_type: z.literal('person'),
    }),
  )

const matches = <T>(cb: () => T) => {
  try {
    cb()
    return true
  } catch (error) {
    return false
  }
}

export function isMovie(param: Movie | Show | Person): param is Movie {
  return matches(() => movieShape.parse(param))
}

export function isShow(param: Movie | Show | Person): param is Show {
  return matches(() => showShape.parse(param))
}

export function isSeason(param: unknown): param is Season {
  return matches(() => seasonShape.parse(param))
}

export function isPerson(param: Movie | Show | Person): param is Person {
  return matches(() => personShape.parse(param))
}

export const classesInAttrs = (attrs?: JSX.HTMLAttributes<any>) =>
  clsx(attrs?.class, attrs?.className)

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

export function getStillPicture<T extends { still_path?: string | null }>(
  item: T,
) {
  return item.still_path
    ? `https://image.tmdb.org/t/p/w500${item.still_path}`
    : undefined
}

export const isMediaType = (param: unknown): param is MediaType =>
  (['movie', 'tv'] as MediaType[]).includes(param as any)

export const isValidSlug = (slug: unknown): slug is Slug =>
  ['popular', 'top_rated', 'discover', 'upcoming'].includes(slug as any)

export const md = new MarkdownIt()
