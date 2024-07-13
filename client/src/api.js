export async function getData() {
    const response = await fetch('https://laura.jasiun.pl/data/')
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    const data = await response.json()

    await Promise.all(
      data.map(
        ({ image }) =>
          new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = img.onabort = () => reject(image)
            img.src = image
          })
      )
    )

    return data;
}