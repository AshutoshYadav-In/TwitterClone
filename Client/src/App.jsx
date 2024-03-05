import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Components/Protectedroute/Protectedroute';
import BarLoader from "react-spinners/BarLoader";
import Signin from './Components/Signin/Signin'
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import Addpost from './Components/Addpost/Addpost';
import Searchcomponent from './Components/Searchcomponent/Searchcomponent';
import Editprofile from './Components/Editprofile/Editprofile';
import { useState ,createContext,useEffect} from 'react';
import Singletweet from './Components/Singletweet/Singletweet';
import Followerinfo from './Components/Followerinfo/Followerinfo';
export const appContext = createContext();
function App() {
  const [currentUser, setCurrentUser] =useState();
  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem("user"));
    setCurrentUser(user);
},[sessionStorage.getItem("user")]);
  const[AppHelpers, SetAppHelpers] =useState({
    toggleforsidebar : false,
    toggleforaddpost: false,
    toggleforeditprofile: false,
    toggleforloading:false
  });
  return (
    <appContext.Provider value={{ AppHelpers, SetAppHelpers,currentUser }}>
    <Router>
    <div className='App'>
    <ToastContainer pauseOnFocusLoss={false} theme="dark" autoClose={2000}/>
    <BarLoader
            color="#2ea5a9"
            cssOverride={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: '1000',
            }}
            loading={AppHelpers.toggleforloading}
            margin={4}
            size={200}
            width={150}
            speedMultiplier={1}
          />
      <Addpost/>
      <Editprofile/>
      <div className={AppHelpers.toggleforaddpost || AppHelpers.toggleforeditprofile || AppHelpers.toggleforloading? 'App-Opacity' : ""}>
      <Routes>
      <Route path='/' element={<Navigate to='/Signin' />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} /> 
      <Route path="/Home" element={<ProtectedRoute element={Home} />} />
      <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
      <Route path="/tweet/:id" element={<ProtectedRoute element={Singletweet} />} />
      <Route path="/Search" element={<ProtectedRoute element={Searchcomponent} />} />
      <Route path="/info/:infotype" element={<ProtectedRoute element={Followerinfo} />} />
      </Routes>
      </div>
    </div>
    </Router>
    </appContext.Provider>
  )
}

export default App
