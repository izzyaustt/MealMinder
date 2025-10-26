import './styles/Login.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.js'
import Login from './pages/Login.js'
import Landing from './pages/Landing.js'
import Fridge from './pages/Fridge.js'
import Upload from './pages/Upload.js'
import Recipes from './pages/Recipes.js'
import Test from './pages/Upload2.js'


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
            <Route path="/test" element={<Test />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
