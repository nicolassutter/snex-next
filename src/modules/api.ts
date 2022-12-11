import type { Movie, Show } from '../../types'
import { default as _axios } from 'axios'

const suffix = '/.netlify/functions/api'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? suffix
    : `http://localhost:8888${suffix}`

const axios = _axios.create({
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
  getPopularMovies(): Promise<Movie[]> {
    return axios.get('/movies/popular')
  },

  getTopMovies(): Promise<Movie[]> {
    return axios.get('/movies/top_rated')
  },

  getUpcomingMovies(): Promise<Movie[]> {
    return axios.get('/movies/upcoming')
  },

  getPopularShows(): Promise<Show[]> {
    return axios.get('/shows/popular')
  },

  getTopShows(): Promise<Show[]> {
    return axios.get('/shows/top_rated')
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

    const {
      data: { results: shows },
    } = await axios.get(`/discover/tv`, {
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

    const {
      data: { results: movies },
    } = await axios.get(`/discover/movie`, {
      params: {
        page: params.page,
        limit: params.limit,
        ...api_filters,
      },
    })

    return movies
  },

  async searchMedia(searchValue: any) {
    const pages = 2
    const pagesArray = Array.from({ length: pages }, (_, index) => index + 1)

    let results: any[] = []

    /**
     * TODO: Promise.all()
     */
    for await (const index of pagesArray) {
      const {
        data: { results: searchResults },
      } = await axios.get(`/search/multi`, {
        params: {
          query: searchValue,
          page: index,
        },
      })

      results = [...results, ...searchResults]
    }

    return results
  },

  async getMedia(params: any) {
    const { type, id } = params

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

    if (['movie', 'tv'].includes(type)) {
      const { data } = await axios.get(`/${type}/${id}`, {
        params: { append_to_response },
      })
      return data
    }
  },

  async getSeason(params: any) {
    const { showId, seasonId } = params
    const { data: season } = await axios.get(`/tv/${showId}/season/${seasonId}`)

    return season
  },

  getMovieGenres: async () => {
    const {
      data: { genres },
    } = await axios.get(`/genre/movie/list`)

    return genres
  },

  getShowGenres: async () => {
    const {
      data: { genres },
    } = await axios.get(`/genre/tv/list`)

    return genres
  },

  async getPerson(id: string) {
    const { data } = await axios.get(
      `/person/${id}?append_to_response=movie_credits,tv_credits`,
    )

    return data
  },

  async getImdbInfo(imdb_id: string) {
    try {
      if (!imdb_id) {
        throw new Error('No id was given')
      }

      const {
        data: { data },
      } = await axios.get(`/entry/${imdb_id}/info`)

      return data
    } catch (error) {
      return []
    }
  },
}
