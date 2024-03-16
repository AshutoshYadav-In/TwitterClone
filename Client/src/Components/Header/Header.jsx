import {React , useContext} from 'react'
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {Link} from "react-router-dom";
import { appContext } from '../../App';
function Header() {
  const {AppHelpers, SetAppHelpers,currentUser} = useContext(appContext);
  //handle sidebar toggle 
  const handleSidebarToggle = ()=>{
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforsidebar: !prevState.toggleforsidebar
    }));
  } 
  return (
    <div className='Header-Component'>
      <div className='Header-Component-Container'>
      <FontAwesomeIcon icon={faXTwitter} style={{ color: "#e7e9ea", }} />
      <Link to="/Search">
      <input type="text" placeholder='Search X' />
      </Link>
      <div onClick={handleSidebarToggle}>
      {
                currentUser?.profileimage === '' ? <img
                  src="https://vectorified.com/images/guest-icon-3.png"
                  alt="image"
                /> : <img
                  src={currentUser?.profileimage}
                  alt="image"
                />
              }
      </div>
      </div>
    </div>
  )
}

export default Header