import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from './Components/Signin/Signin'
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import { useState ,createContext} from 'react';
import Singletweet from './Components/Singletweet/Singletweet';
export const appContext = createContext();
function App() {
  const[AppHelpers, SetAppHelpers] =useState({
    toggleforsidebar : false,
    togglefortry:"hello",
    toggle: false
  });
  return (
    <appContext.Provider value={{ AppHelpers, SetAppHelpers }}>
    <Router>
    <div className='App'>
      <Routes>
      <Route path='/' element={<Navigate to='/Signin' />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Profile" element={<Profile/>} />
      <Route path='/tweet/:id'  element= {<Singletweet/>}/>
      </Routes>
    </div>
    </Router>
    </appContext.Provider>
  )
}

export default App
