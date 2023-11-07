import type {
  ImdbData,
  MediaGenre,
  MediaType,
  Movie,
  SearchMovie,
  SearchPerson,
  SearchShow,
  Season,
  Show,
} from '#types'
import { sortBy } from 'lodash-es'
import { $fetch as _$fetch } from 'ohmyfetch'

const suffix = '/.netlify/functions/api'

const API_URL = import.meta.env.PROD ? suffix : `http://localhost:8888${suffix}`

export const $fetch = _$fetch.create({
  baseURL: API_URL,
})

interface GenericRequestQuery {
  page?: number
}

export const api = {
  getPopularMovies({ page = 1 }: GenericRequestQuery = {}) {
    return $fetch<{ results: Movie[] }>('/tmdb/movie/popular', {
      params: {
        page,
      },
    })
  },

  getTopMovies({ page = 1 }: GenericRequestQuery = {}) {
    return $fetch<{ results: Movie[] }>('/tmdb/movie/top_rated', {
      params: {
        page,
      },
    })
  },

  getUpcomingMovies({ page = 1 }: GenericRequestQuery = {}) {
    return $fetch<{ results: Movie[] }>('/tmdb/movie/upcoming', {
      params: {
        page,
      },
    })
  },

  getPopularShows({ page = 1 }: GenericRequestQuery = {}) {
    return $fetch<{ results: Show[] }>('/tmdb/tv/popular', {
      params: {
        page,
      },
    })
  },

  getTopShows({ page = 1 }: GenericRequestQuery = {}) {
    return $fetch<{ results: Show[] }>('/tmdb/tv/top_rated', {
      params: {
        page,
      },
    })
  },

  async searchMedia(query: string) {
    const pages = 2
    const pagesArray = Array.from({ length: pages }, (_, index) => index + 1)

    let results: (SearchMovie | SearchShow | SearchPerson)[] = []

    /**
     * TODO: Promise.all()
     */
    for await (const index of pagesArray) {
      const { results: searchResults } = await $fetch<{
        results: (SearchMovie | SearchShow | SearchPerson)[]
      }>(`/tmdb/search/multi`, {
        params: {
          query,
          page: index,
        },
      })

      results = [...results, ...searchResults]
    }

    return sortBy(
      results.filter((result) => {
        if (result.media_type === 'person') {
          return result.profile_path
        }

        return result.poster_path
      }),
      'popularity',
    ).reverse()
  },

  async getMedia({ type, id }: { type: MediaType; id: string }) {
    const append_to_response = [
      'credits',
      'videos',
      'watch/providers',
      'recommendations',
      'similar',
      'alternative_titles',
      'release_dates',
      'external_ids',
    ].toString()

    const data = await $fetch<Movie | Show>(`/tmdb/${type}/${id}`, {
      params: { append_to_response },
    })

    return data
  },

  async getSeason({
    showId,
    seasonNumber,
  }: {
    showId: number | string
    seasonNumber: number
  }) {
    const season = await $fetch<Season>(
      `/tmdb/tv/${showId}/season/${seasonNumber}`,
    )
    return season
  },

  async getImdbInfo(imdb_id: string) {
    if (!imdb_id) {
      throw new Error('No id was given')
    }

    const { data } = await $fetch<{ data: ImdbData }>(`/entry/${imdb_id}/info`)

    return data
  },

  async getPerson(id: string | number) {
    const data = await $fetch(
      `/tmdb/person/${id}?append_to_response=movie_credits,tv_credits`,
    )

    return data
  },

  getMovieGenres: async () => {
    const { genres } = await $fetch<{ genres: MediaGenre[] }>(
      `/tmdb/genre/movie/list`,
    )
    return genres
  },

  getShowGenres: async () => {
    const { genres } = await $fetch<{ genres: MediaGenre[] }>(
      `/tmdb/genre/tv/list`,
    )
    return genres
  },
}
