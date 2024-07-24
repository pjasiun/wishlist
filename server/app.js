const { Client } = require('@notionhq/client')
const express = require('express')
const cors = require('cors')

const { port, databaseId, authSecret } = require('./config')

const app = express()
app.use(cors())
app.use(express.json())

const notion = new Client({ auth: authSecret })

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

  // res.send(master.results)

  const promises = master.results.map(
    ({ id, properties }) =>
      new Promise(async (resolve) => {
        const child = await notion.blocks.children.list({
          block_id: id,
        })

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
          image: child.results.find((content) => content.type == 'image')?.image
            ?.file?.url,
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

function toText(richText) {
  return richText
    .filter((item) => item.type === 'text')
    .map((item) => item.plain_text)
    .join('')
}
