import './styles/Login.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Fridge from './pages/Fridge'
import Upload from './pages/Upload'
import Recipes from './pages/Recipes.js'


function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen justify-start items-center">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/myfridge" element={<Fridge />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
