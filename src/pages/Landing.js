import { Link } from 'react-router-dom';
import box from '../images/box.png'; 

function Landing() {
  return (
    <header className="App-header">
      <h1 className="text-center text-amber-700">MealMinder</h1>
      <p>Eliminate food waste :3</p>
      <img src={box} alt="box" />
      
      {/* These Link tags allow navigation */}
      <Link to="/login">I have an account</Link>
      <Link to="/register">Register</Link>
    </header>
  );
}

export default Landing;