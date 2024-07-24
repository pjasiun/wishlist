import './GiftCard.css'

import PaymentsIcon from '@mui/icons-material/Payments'
import StorefrontIcon from '@mui/icons-material/Storefront'
import DescriptionIcon from '@mui/icons-material/Description'
import FavoriteIcon from '@mui/icons-material/Favorite'

import Button from '@mui/material/Button'
import LabeledUrl, { isValidUrl } from './LabeledUrl'

import { Card, CardContent } from '@mui/material'

function GiftCard({ data, onBooking }) {
  return (
    <div className="GiftCard-frame">
      <Card className="GiftCard">
        <CardContent className="GiftCard-content">
          <div className="GiftCard-header">
            <h2 className={data.isBooked ? 'GiftCard-header-booked' : ''}>
              {data.title}
            </h2>
            <div className="GiftCard-bookbutton">
              {data.isBookable ? (
                data.isBooked ? (
                  <Button variant="contained" disabled>
                    Zarezerwowane
                  </Button>
                ) : (
                  <Button variant="contained" onClick={onBooking}>
                    Zarezerwuj
                  </Button>
                )
              ) : (
                ''
              )}
            </div>
          </div>
          <img className="GiftCard-photo" src={data.image} alt={data.title} />
          <div className="GiftCard-details">
            <DetailsRow
              show={data.priority}
              icon={<FavoriteIcon />}
              label="Chce:"
            >
              {data.priority}
            </DetailsRow>
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
    <div className="GiftCard-details-row">
      {icon}
      <p>
        <span className="GiftCard-details-label">{label}</span> {children}
      </p>
    </div>
  )
}

export default GiftCard
