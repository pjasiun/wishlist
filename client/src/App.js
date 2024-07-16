import './App.css'
import '@fontsource-variable/noto-sans'

import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

import { createTheme, ThemeProvider } from '@mui/material'

import { useCallback, useEffect, useState } from 'react'

import { getData, setBooking } from './api'
import Loader from './Loader'
import ConfirmDialog from './ConfirmDialog'
import GiftCard from './GiftCard'

function App({ isPWA }) {
  const [data, setData] = useState([])
  const [reseration, setReseration] = useState({
    state: 'NONE',
    pageId: '',
  })

  useEffect(() => {
    async function init() {
      setData([])

      const data = await getData()

      setData(data)
    }

    if (isPWA) {
      window.addEventListener('visibilitychange', init)
    }

    init()
  }, [isPWA])

  const openConfirm = useCallback(
    (pageId) => setReseration({ state: 'WAITING_FOR_NAME', pageId }),
    []
  )
  const closeConfirm = useCallback(
    () => setReseration({ state: 'NONE', pageId: '' }),
    []
  )

  const reserationSubmit = useCallback(
    async (event) => {
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
    },
    [data, reseration]
  )

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
        <ConfirmDialog
          open={reseration.state !== 'NONE'}
          processing={reseration.state === 'PROCESSING'}
          onCancel={closeConfirm}
          onSubmit={reserationSubmit}
        />
        {data.length === 0 ? (
          <Loader />
        ) : (
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
                <GiftCard data={item} onBooking={() => openConfirm(item.id)} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </ThemeProvider>
    </div>
  )
}

export default App
