import type { Movie, Show } from '#types'
import { useLocalStorage } from 'react-use'

/**
 * Custom hook to compute Radarr & Sonarr paths
 */
export function useArrPaths(media: Show | Movie | null | undefined) {
  const [radarrUrl] = useLocalStorage('radarr-url', '')
  const [sonarrUrl] = useLocalStorage('sonarrr-url', '')

  const imdbTerm = media?.external_ids?.imdb_id
    ? `imdb:${media.external_ids.imdb_id}`
    : undefined

  const tvdbTerm = media?.external_ids?.tvdb_id
    ? `tvdb:${media.external_ids.tvdb_id}`
    : undefined

  const tmdbTerm = media?.external_ids?.imdb_id ? `tmdb:${media.id}` : undefined

  const radarrPath = useMemo(() => {
    return radarrUrl
      ? `${radarrUrl}/add/new?term=${imdbTerm ?? tvdbTerm ?? tmdbTerm}`
      : undefined
  }, [media])

  const sonarrPath = useMemo(() => {
    return sonarrUrl
      ? `${sonarrUrl}/add/new?term=${imdbTerm ?? tvdbTerm ?? tmdbTerm}`
      : undefined
  }, [media])

  return [
    {
      name: 'radarr',
      logo: 'https://raw.githubusercontent.com/Radarr/radarr.github.io/master/logo/radarr.svg',
      path: radarrPath,
    },
    {
      name: 'sonarr',
      logo: 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/Sonarr.svg',
      path: sonarrPath,
    },
  ] as const
}
