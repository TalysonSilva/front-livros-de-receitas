import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Page/Home';
import Login from './components/Page/Login';
import Register from './components/Page/Register';
import RegisterRevenue from './components/Page/RegisterRevenue';
import RecipeUse from './components/Page/RecipeUse ';
import './index.css'

function App() {

  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-revenue" element={<RegisterRevenue/>} />
        <Route path="/recipe-user" element={<RecipeUse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
