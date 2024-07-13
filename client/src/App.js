import './App.css';

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react';

import 'swiper/css'
import 'swiper/css/navigation'

import { getData } from './api';

import Loader from './Loader'

function App({isPWA}) {
  const [data, setData] = useState([])

  useEffect(() => {
    if (isPWA) {
      window.addEventListener('visibilitychange', init)
    }

    init()
  }, [isPWA])

  const init = async () => {
    setData([])

    const data = await getData();

    setData(data)
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
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default App;
