import type { MediaType } from '#types'
import { matchPath, useLocation } from 'react-router'

export const tvRoutePatten = 'tv/:id'
export const movieRoutePatten = 'movie/:id'

/**
 * From current location, gives the current media type
 */
export function useMediaType(): MediaType {
  const loc = useLocation()
  const isTv = Boolean(matchPath(`/media/${tvRoutePatten}`, loc.pathname))
  const isMovie = Boolean(matchPath(`/media/${movieRoutePatten}`, loc.pathname))

  if (isTv) {
    return 'tv'
  }

  if (isMovie) {
    return 'movie'
  }

  throw new Error('Unable to match media type')
}
