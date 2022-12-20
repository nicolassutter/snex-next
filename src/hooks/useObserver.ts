import type { RefObject } from 'preact'
import { useUnmount } from 'react-use'

export function useObserver<T extends RefObject<HTMLElement>>(ref: T) {
  const [mutation, setMutation] = useState<ResizeObserverEntry>()

  const config: ResizeObserverOptions = {
    //
  }

  // Create an observer instance linked to the callback function
  const observer = new ResizeObserver((mutationList) => {
    for (const mutation of mutationList) {
      setMutation(mutation)
    }
  })

  const stop = () => {
    observer.disconnect()
  }

  const start = (el: HTMLElement) => {
    observer.observe(el, config)
  }

  useEffect(() => {
    stop()

    if (ref.current) {
      start(ref.current)
    }
  }, [ref])

  useUnmount(() => {
    stop()
  })

  return mutation
}
