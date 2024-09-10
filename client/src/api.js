export async function getData() {
  const response = await fetch('https://laura.jasiun.pl/data/')
  if (!response.ok) {
    throw new Error('Network response was not ok.')
  }
  const data = await response.json()

  await Promise.all(
    data.slice(0, 5).map(
      ({ image }) =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = img.onabort = () => reject(image)
          img.src = image
        })
    )
  )

  return data
}

export async function setBooking(pageId, booker) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return await fetch('https://laura.jasiun.pl/book/', {
    method: 'POST',
    body: JSON.stringify({ pageId, booker }),
    headers,
  })
}
