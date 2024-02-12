import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from './Components/Signin/Signin'
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
function App() {
  return (
    <Router>

    <div className='App'>
      <Routes>
      <Route path='/' element={<Navigate to='/Signin' />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />
      </Routes>
    </div>
    </Router>
  )
}

export default App
