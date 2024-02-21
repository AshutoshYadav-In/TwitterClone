import {React , useContext} from 'react'
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {Link} from "react-router-dom";
import { appContext } from '../../App';
function Header() {
  const {AppHelpers, SetAppHelpers} = useContext(appContext);
  //handle sidebar toggle 
  const handleSidebarToggle = ()=>{
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforsidebar: !prevState.toggleforsidebar
    }));
  } 
  return (
    <div className='Header-Component'>
      <FontAwesomeIcon icon={faXTwitter} style={{ color: "#e7e9ea", }} />
      <input type="text" placeholder='Search X' />
      <div onClick={handleSidebarToggle}>
        <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706339303/Nextcartassets/l2ar6zznkqmqxorjben5.jpg" alt="" />
      </div>
    </div>
  )
}

export default Header