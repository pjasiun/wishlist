import './Loader.css';
import logo from './logo.svg'

function Loader() {
    return (
        <div className="loader">
            <img src={logo} className="loader-giftbox" alt="logo" />
        </div>
    )
}

export default Loader
