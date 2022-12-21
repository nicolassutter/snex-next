import type { Movie, Show } from '#types'

/**
 */
export function useMediaVideos(media: null | undefined | Movie | Show) {
  const trailers = useMemo(() => {
    return media?.videos.results.filter((video) => {
      return (
        video.type === 'Trailer' &&
        video.site === 'YouTube' &&
        video.official === true
      )
    })
  }, [media])

  const videos = useMemo(() => {
    return media?.videos.results.filter((video) => {
      return (
        video.type !== 'Trailer' &&
        video.official === true &&
        video.type !== 'Featurette'
      )
    })
  }, [media])

  const videosData = useMemo(
    () =>
      [
        {
          name: 'Trailers',
          items: trailers,
        },
        {
          name: 'Videos',
          items: videos,
        },
      ] as const,
    [trailers, videos],
  )

  return {
    trailers,
    videos,
    videosData,
  }
}
