import logo from './logo.svg';
import './App.css';

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react';

import 'swiper/css'
import 'swiper/css/navigation'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    window.addEventListener("visibilitychange", init);

    init();
  }, []);

  const init = async () => {
    setData([])

    const response = await fetch('https://laura.jasiun.pl/images/')
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    const data = await response.json()

    await Promise.all( data.map( ({ image }) => new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = img.onabort = () => reject(image)
        img.src = image
    })))

    setData(data)
  };

  return (
    <div className="App">
      {data.length === 0 ? (
        <div className="loader">
          <img src={logo} className="loader-giftbox" alt="logo" />
        </div>
      ) : (
        <Swiper modules={[Navigation]} slidesPerView={1} navigation>
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="frame">
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
