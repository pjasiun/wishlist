export function isValidUrl(urlString) {
  let url

  try {
    url = new URL(urlString)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export default function LabeledUrl({ children: urlString }) {
  const url = new URL(urlString)

  return (
    <a href={urlString}>
      <span className="LabeledUrl-host">{url.host.replace('www.', '')}</span>
      {url.pathname ? (
        <span className="LabeledUrl-rest">
          {url.pathname.length < 12
            ? url.pathname
            : url.pathname.slice(0, 4) + '...' + url.pathname.slice(-6)}
        </span>
      ) : (
        ''
      )}
    </a>
  )
}
