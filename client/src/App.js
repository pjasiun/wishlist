import './App.css';

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react';

import 'swiper/css'
import 'swiper/css/navigation'

import { getData, setBooking } from './api';

import Loader from './Loader'

function App({isPWA}) {
  const [data, setData] = useState([])

  useEffect(() => {
    if (isPWA) {
      window.addEventListener('visibilitychange', init)
    }

    init()
  }, [isPWA])

  async function init() {
    setData([])

    const data = await getData();

    setData(data)
  }

  function book(pageId) {
    const booker = prompt('Kto rezerwuje?')

    setBooking(pageId, booker);

    setData(data.map(item =>
      item.id !== pageId ? item : {
        ...item,
        isBooked: true
    }))
  }

  return (
    <div className="App">
      {data.length === 0 ? (
        <Loader />
      ) : (
        <Swiper modules={[Navigation]} slidesPerView={1} navigation>
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="photoFrame">
                <img className="photo" src={item.image} alt={item.title} />
              </div>
              <h1>{item.title}</h1>
              <p>
                {item.isBooked ? (
                  'Zarezerwowane'
                ) : (
                  <button onClick={() => book(item.id)}>Zarezerwuj</button>
                )}
              </p>
              <p>Cena: {item.price}</p>
              <p>link: {item.link}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default App;
