import { api } from '#src/modules/api'
import type { Show } from '#types'
import { set } from 'lodash-es'
import { action, atom, map } from 'nanostores'

export const hasFetchedTvAtom = atom(false)

export const tvStore = map({
  popular: {
    fn: () => api.getPopularShows(),
    items: [] as Show[],
    label: 'Popular shows',
  },

  top_rated: {
    fn: () => api.getTopShows(),
    items: [] as Show[],
    label: 'Top rated shows',
  },
})

export const populateTvStore = action(
  tvStore,
  'populateTvStore',
  async (store) => {
    const storeValue = store.get()

    /**
     * For each category in tv store,
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
    tvStore.notify()
  },
)
