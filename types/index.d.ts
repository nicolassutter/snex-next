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

export enum Department {
  Acting = 'Acting',
  Art = 'Art',
  Camera = 'Camera',
  CostumeMakeUp = 'Costume & Make-Up',
  Crew = 'Crew',
  Directing = 'Directing',
  Editing = 'Editing',
  Lighting = 'Lighting',
  Production = 'Production',
  Sound = 'Sound',
  VisualEffects = 'Visual Effects',
  Writing = 'Writing',
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
  season_number: number
  first_air_date: string
  episode_run_time: string[]
  seasons: Season[]
}

export interface Person {
  name: string
  profile_path: string
  movie_credits: Credits
  tv_credits: Credits
  biography: string
  known_for_department: string
  birthday: string
}
