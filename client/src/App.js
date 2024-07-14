import './App.css'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react'

import 'swiper/css'
import 'swiper/css/navigation'

import { getData, setBooking } from './api'

import Loader from './Loader'

import logo from './logo.svg'

import Button from '@mui/material/Button'
import LabeledUrl, { isValidUrl } from './LabeledUrl'
import {
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'

function App({ isPWA }) {
  const [data, setData] = useState([])
  const [reseration, setReseration] = useState({
    state: 'NONE',
    pageId: '',
  })

  function openConfirm(pageId) {
    setReseration({ state: 'WAITING_FOR_NAME', pageId })
  }

  function closeConfirm() {
    setReseration({ state: 'NONE', pageId: '' })
  }

  useEffect(() => {
    if (isPWA) {
      window.addEventListener('visibilitychange', init)
    }

    init()
  }, [isPWA])

  async function init() {
    setData([])

    const data = await getData()

    setData(data)
  }

  async function reserationSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const booker = Object.fromEntries(formData.entries()).name

    if (booker) {
      setReseration({ state: 'PROCESSING', pageId: reseration.pageId })

      await setBooking(reseration.pageId, booker)

      setData(
        data.map((item) =>
          item.id !== reseration.pageId
            ? item
            : {
                ...item,
                isBooked: true,
              }
        )
      )

      setReseration({ state: 'NONE', pageId: '' })
    }
  }

  return (
    <div className="App">
      <Dialog
        open={reseration.state !== 'NONE'}
        onClose={closeConfirm}
        PaperProps={{
          component: 'form',
          onSubmit: reserationSubmit,
        }}
      >
        <DialogTitle>Rezerwacja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Podaj swoje imię, żebyśmy wiedzieli kto zarezerwował prezent. Twoje
            imię będzie widoczne wyłącznie dla rodziców Laury.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Twoje imię"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Anuluj</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={reseration.state === 'PROCESSING'}
          >
            {reseration.state !== 'PROCESSING' ? 'Rezerwuj' : 'Rezerwuję...'}
          </Button>
        </DialogActions>
      </Dialog>
      {data.length === 0 ? (
        <Loader />
      ) : (
        <main>
          <header>
            <img src={logo} alt="logo" />
            <h1 className="App-h1-text">Prezenty Laury</h1>
          </header>
          <Swiper
            modules={[Navigation]}
            slidesPerView={'auto'}
            navigation
            centeredSlides={true}
            keyboard={{
              enabled: true,
            }}
            className="App-Swiper"
          >
            {data.map((item) => (
              <SwiperSlide key={item.id} className="App-SwiperSlide">
                <div className="App-card-frame">
                  <Card className="App-card">
                    <CardContent className="App-card-content">
                      <div className="App-card-header">
                        <h2>{item.title}</h2>
                        <div class="App-card-bookbutton">
                          {item.isBooked ? (
                            <Button variant="contained" disabled>
                              Zarezerwowane
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={() => openConfirm(item.id)}
                            >
                              Zarezerwuj
                            </Button>
                          )}
                        </div>
                      </div>
                      <img
                        className="App-card-photo"
                        src={item.image}
                        alt={item.title}
                      />
                      <div className="App-card-details">
                        {item.price ? <p>Cena: {item.price} zł</p> : ''}
                        {item.link ? (
                          <p>
                            link:{' '}
                            {isValidUrl(item.link) ? (
                              <LabeledUrl>{item.link}</LabeledUrl>
                            ) : (
                              item.link
                            )}
                          </p>
                        ) : (
                          ''
                        )}
                        {item.description ? <p>{item.description}</p> : ''}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </main>
      )}
    </div>
  )
}

export default App
