const { Client } = require('@notionhq/client')
const express = require('express')
const cors = require('cors')
const sharp = require('sharp')

const { port, databaseId, authSecret } = require('./config')

const app = express()
app.use(cors())
app.use(express.json())

const notion = new Client({ auth: authSecret })

const cachedPagesTimestamps = {}
const cachedImages = {}

app.get('/data/', async (req, res) => {
  const master = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Kupione',
      checkbox: {
        equals: false,
      },
    },
    sorts: [
      {
        property: 'Chcę',
        direction: 'ascending',
      },
      {
        property: 'Cena',
        direction: 'ascending',
      },
    ],
  })

  const promises = master.results.map(
    ({ id, last_edited_time, properties }) =>
      new Promise(async (resolve) => {
        const image = await getImage(id, last_edited_time)

        resolve({
          id,
          price: properties['Cena']?.number,
          link: toText(properties['Gdzie kupic?']?.rich_text),
          title: toText(properties['Prezent']?.title),
          description: toText(properties['Opis']?.rich_text),
          price: properties['Cena']?.number,
          priority: properties['Chcę']?.select?.name,
          isBookable: !properties['Nierezerwowalne']?.checkbox,
          isBooked:
            !properties['Nierezerwowalne']?.checkbox &&
            !!toText(properties['Rezerwacja']?.rich_text),
          image,
        })
      })
  )

  const results = await Promise.all(promises)

  res.send(results)
})

app.post('/book/', async (req, res) => {
  const pageId = req.body?.pageId
  const booker = req.body?.booker

  if (!pageId) {
    res.status(400).send('Missing page id')
    return
  }

  if (!booker) {
    res.status(400).send('Missing booker')
    return
  }

  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      Rezerwacja: {
        rich_text: [
          {
            text: {
              content: booker,
            },
          },
        ],
      },
    },
  })

  res.send(response)
})

app.listen(port, () => {
  console.log(`App started on port ${port}`)
})

async function getImage(id, last_edited_time) {
  if (cachedPagesTimestamps[id] == last_edited_time) {
    console.log(`used cashed page data for ${id}`)
    return `images/${id}.jpg`
  }

  const child = await notion.blocks.children.list({
    block_id: id,
  })

  const remoteImageUrl = child.results.find(
    (content) => content.type == 'image'
  )?.image?.file?.url

  if (cachedImages[id] == remoteImageUrl) {
    console.log(`used cashed image cache for ${id}`)
    return `images/${id}.jpg`
  }

  const response = await fetch(remoteImageUrl)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  await sharp(buffer)
    .resize(780, 500, {
      fit: sharp.fit.inside,
    })
    .withMetadata()
    .flatten({ background: '#ffffff' })
    .jpeg({
      quality: 70,
      progressive: true,
    })
    .toFile(`public/images/${id}.jpg`)

  cachedImages[id] = remoteImageUrl
  cachedPagesTimestamps[id] = last_edited_time

  console.log(`updated image cache for ${id}`)

  return `images/${id}.jpg`
}

function toText(richText) {
  return richText
    .filter((item) => item.type === 'text')
    .map((item) => item.plain_text)
    .join('')
}
