import { useLocalStorage } from 'react-use'

export default function Settings() {
  const [radarrUrl, setRadarrUrl] = useLocalStorage('radarr-url', '')
  const [sonarrUrl, setSonarrUrl] = useLocalStorage('sonarrr-url', '')
  const radarrInput = useRef<HTMLInputElement | null>(null)
  const sonarrInput = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <Helmet>
        <title>Settings | SNEX</title>
      </Helmet>

      <div className='settings-page'>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setRadarrUrl(radarrInput.current?.value)
            setSonarrUrl(sonarrInput.current?.value)
          }}
        >
          <div>
            <label
              className='font-bold'
              htmlFor='radarr-input'
            >
              Radarr Url (*)
            </label>

            <input
              ref={radarrInput}
              id='radarr-input'
              type='url'
              value={radarrUrl}
              className='input input-bordered max-w-sm w-full block mt-2'
              placeholder='https://example.com'
            />
          </div>

          <div className='mt-5'>
            <label
              className='font-bold'
              htmlFor='sonarr-input'
            >
              Sonarr Url (*)
            </label>

            <input
              ref={sonarrInput}
              id='sonarr-input'
              type='url'
              value={sonarrUrl}
              className='input input-bordered max-w-sm w-full block mt-2'
              placeholder='https://example.com'
            />
          </div>

          <button
            type='submit'
            className='btn mt-5'
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
