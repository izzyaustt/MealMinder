import { Link } from 'react-router-dom';
import box from '../images/box.png'; 
import logo from '../images/mealminder.png';
import '../styles/Landing.css';

function Landing() {
  return (
    <header className="App-header">
      <div className="left-section">
        <img src={logo} alt="MealMinder" className="landing-logo" />
        <p>Eliminate food waste</p>
        <div className="button-group">
          <Link to="/login" className="primary-button">I have an account</Link>
          <Link to="/register" className="secondary-button">Register</Link>
        </div>
      </div>

      <div className="right-section">
        <img src={box} alt="box" className="boximg" />
      </div>
    </header>
  );
}

export default Landing;
