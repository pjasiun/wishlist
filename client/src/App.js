import './App.css'

import '@fontsource-variable/noto-sans'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react'

import PaymentsIcon from '@mui/icons-material/Payments'
import StorefrontIcon from '@mui/icons-material/Storefront'
import DescriptionIcon from '@mui/icons-material/Description'

import 'swiper/css'
import 'swiper/css/navigation'

import { getData, setBooking } from './api'

import Loader from './Loader'

import Button from '@mui/material/Button'
import LabeledUrl, { isValidUrl } from './LabeledUrl'
import {
  Card,
  CardContent,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  ThemeProvider,
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

  const theme = createTheme({
    typography: {
      fontFamily: ['Noto Sans Variable'],
    },
    palette: {
      primary: {
        light: '#ECFFE6',
        main: '#399918',
        dark: '#266c0e',
        contrastText: '#fff',
      },
    },
  })

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
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
            <p className="Dialog-text">
              Podaj swoje imię, żebyśmy wiedzieli kto zarezerwował prezent.
              Twoje imię będzie widoczne wyłącznie dla rodziców Laury.
            </p>
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
            <header></header>
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
                          <h2
                            className={
                              item.isBooked ? 'App-card-header-booked' : ''
                            }
                          >
                            {item.title}
                          </h2>
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
                          {item.price ? (
                            <div className="App-card-details-row">
                              <PaymentsIcon />
                              <p>
                                <span className="App-card-details-key">
                                  Orientacyjna cena:
                                </span>{' '}
                                {item.price} zł
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                          {item.link ? (
                            <div className="App-card-details-row">
                              <StorefrontIcon />
                              <p>
                                <span className="App-card-details-key">
                                  Gdzie kupić:
                                </span>{' '}
                                {isValidUrl(item.link) ? (
                                  <LabeledUrl>{item.link}</LabeledUrl>
                                ) : (
                                  item.link
                                )}
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                          {item.description ? (
                            <div className="App-card-details-row">
                              <DescriptionIcon />
                              <p>
                                <span className="App-card-details-key">
                                  Uwagi:
                                </span>{' '}
                                {item.description}
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </main>
        )}
      </ThemeProvider>
    </div>
  )
}

export default App
