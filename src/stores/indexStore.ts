import { api } from '#src/modules/api'
import type { Movie, Show } from '#types'
import { set } from 'lodash-es'
import { action, atom, map } from 'nanostores'

export const hasFetchedAtom = atom(false)

export const indexStore = map({
  upcoming_movies: {
    fn: () => api.getUpcomingMovies(),
    items: [] as Movie[],
    label: 'Upcoming movies',
  },

  popular_movies: {
    fn: () => api.getPopularMovies(),
    items: [] as Movie[],
    label: 'Popular movies',
  },

  top_rated_movies: {
    fn: () => api.getTopMovies(),
    items: [] as Movie[],
    label: 'Top rated movies',
  },

  popular_tv: {
    fn: () => api.getPopularShows(),
    items: [] as Show[],
    label: 'Popular shows',
  },

  top_rated_tv: {
    fn: () => api.getTopShows(),
    items: [] as Show[],
    label: 'Top rated shows',
  },
})

export const populateIndexStore = action(
  indexStore,
  'populateIndexStore',
  async (store) => {
    const storeValue = store.get()

    /**
     * For each category in store,
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
    indexStore.notify()
  },
)
