import type { LiteralUnion } from 'type-fest'

export interface Video {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface Cast {
  adult: boolean
  gender: number
  id: number
  known_for_department: Department
  name: string
  original_name: string
  popularity: number
  profile_path: null | string
  character?: string
  credit_id: string
  order?: number
  department?: Department
  job?: string
  poster_path: string
  backdrop_path: string
}

export interface Credits {
  cast: Cast[]
  crew: Cast[]
}

export interface Provider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
  logo: string
}

interface Common {
  id: string
  name?: string
  title?: string
  providers: Provider[]
  credits: Credits
  external_ids: { tvdb_id?: number; imdb_id: string }
  overview: string
  vote_count: number
  vote_average: number
  release_date: string
  original_language: string
  genres: MediaGenre[]
  runtime: number
  videos: {
    results: Video[]
  }
  'watch/providers': {
    results: {
      [country: string]: {
        flatrate: Provider[]
      }
    }
  }
  recommendations: { results: (Movie | Show)[] }
  similar: { results: (Movie | Show)[] }
}
export interface MediaGenre {
  id: number
  name: string
}

export interface Episode {
  air_date: string
  episode_number: number
  crew: Cast[]
  guest_stars: Cast[]
  id: number
  name: string
  overview: string
  production_code: string
  season_number: number
  still_path: null | string
  vote_average: number
  vote_count: number
}

export interface Season {
  _id: string
  air_date: string
  episodes: Episode[]
  name: string
  overview: string
  id: number
  poster_path: string
  season_number: number
}

export interface Movie extends Common {
  title: string
  poster_path: string
  backdrop_path: string
  release_date: string
}
export interface Show extends Common {
  name: string
  poster_path: string
  backdrop_path: string
  number_of_seasons: number
  number_of_episodes: number
  first_air_date: string
  episode_run_time: number[]
  seasons: Season[]
}

export interface Person {
  id: number
  name: string
  profile_path: string
  movie_credits: Credits
  tv_credits: Credits
  biography: string
  known_for_department: string
  birthday: string
  deathday: string
}

export type MediaType = 'movie' | 'tv'

export type Department = LiteralUnion<
  | 'Directing'
  | 'Production'
  | 'Camera'
  | 'Acting'
  | 'Sound'
  | 'Art'
  | 'Crew'
  | 'Editing'
  | 'Lighting'
  | 'Visual Effects'
  | 'Writing'
  | 'Costume & Make-Up',
  string
>

export interface SearchMovie extends Movie {
  media_type: MediaType
}

export interface SearchShow extends Show {
  media_type: MediaType
}

export interface SearchPerson extends Person {
  media_type: 'person'
}

export interface ImdbData {
  score: number
  reviews: {
    rating: number
    title: string
    author: string
    author_details: {
      username: string
      rating: number
    }
    url: string
    content: string
    date: string
    created_at: string
    updated_at: string
  }[]
}
