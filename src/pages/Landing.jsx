import { Link } from 'react-router-dom';
import box from '../images/box.png'; 
import '../App.css'

const Landing = () => {
  console.log('hi')
  return (
    <header className="App-header">
      <h1 className="title">MealMinder</h1>
      <p>Eliminate food waste :3</p>
      <img src={box} alt="box" />
      
      {/* These Link tags allow navigation */}
      <Link to="/login" className="primary-button">I have an account</Link>
      <Link to="/register" className="secondary-button">Register</Link>
    </header>
  );
}

export default Landing;