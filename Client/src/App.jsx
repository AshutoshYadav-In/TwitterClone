import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from './Components/Signin/Signin'
function App() {
  return (
    <Router>

    <div className='App'>
      <Routes>
      <Route path="/Login" element={<Signin />} />
      </Routes>
    </div>
    </Router>
  )
}

export default App
