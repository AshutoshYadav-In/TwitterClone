import {React, useContext} from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'; 
import { faX } from '@fortawesome/free-solid-svg-icons';
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
              <div className='Sidebar-Component-Profiledetails-Upper-Imagecon'>
               <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706339303/Nextcartassets/l2ar6zznkqmqxorjben5.jpg" alt="" />
              </div>
               <div className='Sidebar-Component-Profiledetails-Namecon'>
                <p>Ashutosh Yadav</p>
                <p>@ashopeditz123</p>
               </div>
             </div>
             <div className='Sidebar-Component-Profiledetails-Lower'>
                <div>
                    <p>23</p>
                    <p>Following</p>
                </div>
                <div>
                    <p>11</p>
                    <p>Followers</p>
                </div>
             </div>
            </div>
            <div className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faUser} style={{color: "#e7e9ea",}} />
            <p>View Profile</p>
            </div>
            <div className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faCode} style={{color: "#e7e9ea",}} />
            <p>About Developer</p>
            </div>
            <div className='Sidebar-Component-Options'>
            <FontAwesomeIcon icon={faArrowRightFromBracket} style={{color: "#e7e9ea"}} />
            <p>Logout</p>
            </div>
            <div className='Sidebar-Component-Post'>
            <FontAwesomeIcon icon={faFeatherPointed} style={{color: "#e7e9ea",}} />
            <p>Post</p>
            </div>
        </div>
    </div>
  )
}

export default Sidebar