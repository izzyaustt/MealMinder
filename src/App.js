import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/Login'
import Landing from './pages/Landing'


function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen justify-start items-center">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
