import type { Movie, Show } from '#types'
import { uniqBy } from 'lodash-es'

/**
 * @returns Data for the box containing "Directors", "Produces" and "Writers"
 */
export function useMediaCrew(media: null | undefined | Movie | Show) {
  return useMemo(
    () =>
      [
        {
          name: 'Directors',
          items: uniqBy(
            media?.credits.crew.filter(
              (crewMember) => crewMember.department === 'Directing',
            ) ?? [],
            'id',
          ),
        },
        {
          name: 'Producers',
          items: uniqBy(
            media?.credits.crew.filter(
              (crewMember) => crewMember.department === 'Production',
            ) ?? [],
            'id',
          ),
        },
        {
          name: 'Writers',
          items: uniqBy(
            media?.credits.crew.filter(
              (crewMember) => crewMember.department === 'Writing',
            ) ?? [],
            'id',
          ),
        },
      ] as const,
    [media],
  )
}
