import { api } from '#src/modules/api'
import type { Movie } from '#types'
import { set } from 'lodash-es'
import { action, atom, map } from 'nanostores'

export const hasFetchedMoviesAtom = atom(false)

export const moviesStore = map({
  upcoming: {
    fn: () => api.getUpcomingMovies(),
    items: [] as Movie[],
    label: 'Upcoming movies',
  },

  popular: {
    fn: () => api.getPopularMovies(),
    items: [] as Movie[],
    label: 'Popular movies',
  },

  top_rated: {
    fn: () => api.getTopMovies(),
    items: [] as Movie[],
    label: 'Top rated movies',
  },
})

export const populateMoviesStore = action(
  moviesStore,
  'populateMoviesStore',
  async (store) => {
    const storeValue = store.get()

    /**
     * For each category in movies store,
     * get the corresponding items and save them in the state.
     */
    await Promise.all(
      Object.entries(storeValue).map(async ([key, { fn }]) => {
        const result = await fn()

        // Mutates the store directly (without `store.setKey()`)
        set(storeValue, `${key}.items`, result.data?.results ?? [])
      }),
    )

    /**
     * State should be up to date,
     * because we mutate the state directly,
     * we must notify the components for an update.
     */
    moviesStore.notify()
  },
)
