import { Link } from 'react-router-dom';
import box from '../images/box.png'; 
import logo from '../images/mealminder.png';
import '../App.css'

function Landing() {
  return (
    <header className="App-header">
      <img src={logo} alt="MealMinder" className="logo" />
      <p>Eliminate food waste</p>
      <img src={box} alt="box" className="boximg" />
      
      {/* These Link tags allow navigation */}
      <Link to="/login" className="primary-button">I have an account</Link>
      <Link to="/register" className="secondary-button">Register</Link>
    </header>
  );
}

export default Landing;