import type {
  ImdbData,
  MediaType,
  Movie,
  SearchMovie,
  SearchPerson,
  SearchShow,
  Show,
} from '#types'
import { sortBy } from 'lodash-es'
import { $fetch as _$fetch } from 'ohmyfetch'

const suffix = '/.netlify/functions/api'

const API_URL = import.meta.env.PROD ? suffix : `http://localhost:8888${suffix}`

const $fetch = _$fetch.create({
  baseURL: API_URL,
})

interface Options {
  page: number
  limit: number
  add: boolean
  filters?: {
    genres: { value: string }[]
    language: { value: string }
  }
}

export const api = {
  getPopularMovies() {
    return $fetch<{ results: Movie[] }>('/tmdb/movie/popular')
  },

  getTopMovies() {
    return $fetch<{ results: Movie[] }>('/tmdb/movie/top_rated')
  },

  getUpcomingMovies() {
    return $fetch<{ results: Movie[] }>('/tmdb/movie/upcoming')
  },

  getPopularShows() {
    return $fetch<{ results: Show[] }>('/tmdb/tv/popular')
  },

  getTopShows() {
    return $fetch<{ results: Show[] }>('/tmdb/tv/top_rated')
  },

  async getDiscoverShows(options: Partial<Options> = {}) {
    const params: Options = {
      page: 1,
      limit: 20,
      add: false,
      ...options,
    }

    const api_filters: Partial<{
      with_genres: string
      with_original_language: string
    }> = {}

    if (options) {
      const { filters } = options
      const { genres: genresFilters, language } = filters || {}

      if (genresFilters) {
        api_filters.with_genres = genresFilters
          .map((genre) => genre.value)
          .toString()
      }

      if (language) {
        api_filters.with_original_language = language.value
      }
    }

    const { results: shows } = await $fetch(`/discover/tv`, {
      params: {
        page: params.page,
        limit: params.limit,
        ...api_filters,
      },
    })

    return shows
  },

  async getDiscoverMovies(options: Partial<Options> = {}) {
    const params: Options = {
      page: 1,
      limit: 20,
      add: false,
      ...options,
    }

    const api_filters: Partial<{
      with_genres: string
      with_original_language: string
    }> = {}

    if (options) {
      const { filters } = options
      const { genres: genresFilters, language } = filters || {}

      if (genresFilters) {
        api_filters.with_genres = genresFilters
          .map((genre) => genre.value)
          .toString()
      }

      if (language) {
        api_filters.with_original_language = language.value
      }
    }

    const { results: movies } = await $fetch(`/discover/movie`, {
      params: {
        page: params.page,
        limit: params.limit,
        ...api_filters,
      },
    })

    return movies
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

  async getSeason(params: any) {
    const { showId, seasonId } = params
    const { data: season } = await $fetch(`/tv/${showId}/season/${seasonId}`)

    return season
  },

  getMovieGenres: async () => {
    const { genres } = await $fetch(`/genre/movie/list`)

    return genres
  },

  getShowGenres: async () => {
    const { genres } = await $fetch(`/genre/tv/list`)

    return genres
  },

  async getPerson(id: string | number) {
    const data = await $fetch(
      `/tmdb/person/${id}?append_to_response=movie_credits,tv_credits`,
    )

    return data
  },

  async getImdbInfo(imdb_id: string) {
    if (!imdb_id) {
      throw new Error('No id was given')
    }

    const { data } = await $fetch<{ data: ImdbData }>(`/entry/${imdb_id}/info`)

    return data
  },
}
