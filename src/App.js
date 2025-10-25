import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/Login'
import box from './images/box.png'
// import Landing from './pages/Landing'


function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen justify-start items-center">
          <header className="App-header">
            <h1 className="text-center text-amber-700">MealMinder</h1>
            <p>Eliminate food waste :3</p>
            <img src={box} alt="box" />
            <Link to="/login">I have an account</Link>
            <Link to="/register">Register</Link>
          </header>

          <Routes>
            {/* <Route path="/" element={<App />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
