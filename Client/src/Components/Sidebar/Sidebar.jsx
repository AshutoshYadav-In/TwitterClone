import {React, useContext} from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'; 
import { faX , faHouse} from '@fortawesome/free-solid-svg-icons';
import { faFeatherPointed,faArrowRightFromBracket, faCode } from '@fortawesome/free-solid-svg-icons'; 
import { appContext } from '../../App';
function Sidebar() {
  const {AppHelpers, SetAppHelpers} = useContext(appContext);
  //handle sidebar toggle 
  const handleSidebarToggle = ()=>{
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforsidebar: !prevState.toggleforsidebar
    }));
  } 
  return (
    <div className={AppHelpers.toggleforsidebar? 'Sidebar-Component Sidebar-Component-Transition' : "Sidebar-Component"}>
        <div className='Sidebar-Component-Upper'>
        <FontAwesomeIcon icon={faX} style={{color: "#e7e9ea",}} onClick={handleSidebarToggle}/>
            <div className='Sidebar-Component-Profiledetails'>
             <div className='Sidebar-Component-Profiledetails-Upper'>
              <Link to="/profile" className='Sidebar-Component-Profiledetails-Upper-Imagecon'>
               <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706339303/Nextcartassets/l2ar6zznkqmqxorjben5.jpg" alt="" />
              </Link>
               <Link to="/Profile" className='Sidebar-Component-Profiledetails-Namecon'>
                <p>Ashutosh Yadav</p>
                <p>@ashopeditz123</p>
               </Link>
             </div>
             <div className='Sidebar-Component-Profiledetails-Lower'>
              <Link to="/info/Following">
                    <p>23</p>
                    <p>Following</p>
              </Link>
              <Link to="/info/Followers">
                    <p>23</p>
                    <p>Followers</p>
              </Link>
               
             </div>
            </div>
            <Link to="/Home" className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faHouse} style={{color: "#e7e9ea",}} />
            <p>Home</p>
            </Link>
            <Link to="/Profile"  className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faUser} style={{color: "#e7e9ea",}} />
            <p>View Profile</p>
            </Link>
            <Link to="/About"  className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faCode} style={{color: "#e7e9ea",}} />
            <p>About Developer</p>
            </Link>
            <Link className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faArrowRightFromBracket} style={{color: "#e7e9ea"}} />
            <p>Logout</p>
            </Link>
            <div className='Sidebar-Component-Post'>
            <FontAwesomeIcon icon={faFeatherPointed} style={{color: "#e7e9ea",}} />
            <p>Post</p>
            </div>
        </div>
    </div>
  )
}

export default Sidebar