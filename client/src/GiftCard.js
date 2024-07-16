import PaymentsIcon from '@mui/icons-material/Payments'
import StorefrontIcon from '@mui/icons-material/Storefront'
import DescriptionIcon from '@mui/icons-material/Description'

import Button from '@mui/material/Button'
import LabeledUrl, { isValidUrl } from './LabeledUrl'

import { Card, CardContent } from '@mui/material'

function GiftCard({ data, onBooking }) {
  return (
    <div className="App-card-frame">
      <Card className="App-card">
        <CardContent className="App-card-content">
          <div className="App-card-header">
            <h2 className={data.isBooked ? 'App-card-header-booked' : ''}>
              {data.title}
            </h2>
            <div className="App-card-bookbutton">
              {data.isBooked ? (
                <Button variant="contained" disabled>
                  Zarezerwowane
                </Button>
              ) : (
                <Button variant="contained" onClick={onBooking}>
                  Zarezerwuj
                </Button>
              )}
            </div>
          </div>
          <img className="App-card-photo" src={data.image} alt={data.title} />
          <div className="App-card-details">
            <DetailsRow
              show={data.price}
              icon={<PaymentsIcon />}
              label="Orientacyjna cena:"
            >
              {data.price} zł
            </DetailsRow>
            <DetailsRow
              show={data.link}
              icon={<StorefrontIcon />}
              label="Gdzie kupić:"
            >
              {isValidUrl(data.link) ? (
                <LabeledUrl>{data.link}</LabeledUrl>
              ) : (
                data.link
              )}
            </DetailsRow>

            <DetailsRow
              show={data.description}
              icon={<DescriptionIcon />}
              label="Uwagi:"
            >
              {data.description}
            </DetailsRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailsRow({ show, icon, label, children }) {
  if (!show) {
    return <div></div>
  }
  return (
    <div className="App-card-details-row">
      {icon}
      <p>
        <span className="App-card-details-label">{label}</span> {children}
      </p>
    </div>
  )
}

export default GiftCard
