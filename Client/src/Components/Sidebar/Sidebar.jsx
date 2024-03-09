import { React, useContext, useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './Sidebar.css';
import axios from 'axios';
import { BASE_URL } from '../Helpers/Base_Url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faX, faHouse } from '@fortawesome/free-solid-svg-icons';
import { faFeatherPointed, faArrowRightFromBracket, faCode } from '@fortawesome/free-solid-svg-icons';
import { appContext } from '../../App';
function Sidebar() {
  const { AppHelpers, SetAppHelpers, currentUser } = useContext(appContext);
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate();
  //handle sidebar toggle 
  const handleSidebarToggle = () => {
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforsidebar: !prevState.toggleforsidebar
    }));
  }
  //handle add post toggle 
  const handleAddpostToggle = () => {
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforaddpost: !prevState.toggleforaddpost,
      toggleforsidebar: !prevState.toggleforsidebar
    }));
  }
  //logout
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    toast.success("Sign Out Successful");
    navigate('/signin')
  }
  //getting user 
  useEffect(() => {
    const fetchData = async () => {
      if(!currentUser){
        return
      }
      try {
        const token = sessionStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
        };
        const response = await axios.get(`${BASE_URL}/api/user/getuser/${currentUser._id}`, { headers });
        setUserDetails(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentUser]);
  return (
    <div className={AppHelpers.toggleforsidebar ? 'Sidebar-Component Sidebar-Component-Transition' : "Sidebar-Component"}>
      <div className='Sidebar-Component-Upper'>
        <FontAwesomeIcon icon={faX} style={{ color: "#e7e9ea", }} onClick={handleSidebarToggle} />
        <div className='Sidebar-Component-Profiledetails'>
          <div className='Sidebar-Component-Profiledetails-Upper'>
            <Link to={`/profile/${currentUser?._id}`}className='Sidebar-Component-Profiledetails-Upper-Imagecon'>
              {
                userDetails?.profileimage === '' ? <img
                  src="https://vectorified.com/images/guest-icon-3.png"
                  alt="image"
                /> : <img
                  src={userDetails?.profileimage}
                  alt="image"
                />
              }
            </Link>
            <Link to={`/profile/${currentUser?._id}`}className='Sidebar-Component-Profiledetails-Namecon'>
              <p>{userDetails?.username}</p>
              <p>@{userDetails?.name}</p>
            </Link>
          </div>
          <div className='Sidebar-Component-Profiledetails-Lower'>
            <Link to="/info/Following">
              <p>{userDetails?.following.length}</p>
              <p>Following</p>
            </Link>
            <Link to="/info/Followers">
              <p>{userDetails?.followers.length}</p>
              <p>Followers</p>
            </Link>
          </div>
        </div>
        <Link to="/Home" className='Sidebar-Component-Options'>
          <FontAwesomeIcon icon={faHouse} style={{ color: "#e7e9ea", }} />
          <p>Home</p>
        </Link>
        <Link to={`/profile/${currentUser?._id}`} className='Sidebar-Component-Options'>
          <FontAwesomeIcon icon={faUser} style={{ color: "#e7e9ea", }} />
          <p>View Profile</p>
        </Link>
        <Link to="/About" className='Sidebar-Component-Options'>
          <FontAwesomeIcon icon={faCode} style={{ color: "#e7e9ea", }} />
          <p>About Developer</p>
        </Link>
        <Link className='Sidebar-Component-Options' onClick={logout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: "#e7e9ea" }} />
          <p>Logout</p>
        </Link>
        <div className='Sidebar-Component-Post' onClick={handleAddpostToggle}>
          <FontAwesomeIcon icon={faFeatherPointed} style={{ color: "#e7e9ea", }} />
          <p>Post</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar