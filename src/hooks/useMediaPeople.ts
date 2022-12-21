import type { Cast, Movie, Show } from '#types'
import { sortBy } from 'lodash-es'

/**
 * Computes the profiles shown in the "People section"
 */
export function useMediaPeople(media: null | undefined | Movie | Show) {
  const people = useMemo(() => {
    // Crew members sorted by highest popularity fist
    const crew = sortBy(
      media?.credits.crew.slice(0, 10) ?? [],
      (person) => person.popularity,
    ).reverse()

    // Cast members sorted by highest popularity fist
    const cast = sortBy(
      media?.credits.cast ?? [],
      (person) => person.popularity,
    ).reverse()

    // The crew people are always displayed first
    const _people = [...crew, ...cast].reduce((acc, person, _index) => {
      if (!person.profile_path) {
        return acc
      }

      // No duplicate persons (e.g a director also played a character)
      const alreadyPresentIndex = acc.findIndex(
        (originalPerson) => originalPerson.id === person.id,
      )

      const isPresent = alreadyPresentIndex > -1

      const isActor = Boolean(person.character)

      // We do not display uncredited persons
      const isUncreditedCharacter = Boolean(
        isActor && person.character?.includes('uncredited'),
      )

      if (!isPresent && !isUncreditedCharacter) {
        acc.push(person)
      } else if (!isActor) {
        // Fuse the duplicate's job with the one already present
        acc[
          alreadyPresentIndex
        ].job = `${acc[alreadyPresentIndex].job}, ${person.job}`
      }

      return acc
    }, [] as Cast[])

    return _people
  }, [media])

  return people
}
