import React, { useState,useContext, useEffect } from "react";
import "./Profiledetails.css";
import { Link,useParams } from "react-router-dom";
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
function Profiledetails() {
  const{id} = useParams()
  const {SetAppHelpers,currentUser} = useContext(appContext);
  const[userDetails,setUserDetails] =useState();
  const[ToggleOptions, SetToggleOptions] = useState('posts');
       //function for options(post,replies,likes)
       const ToggleOptionsFunc = (e)=> {
      SetToggleOptions(e)
       }
       //toggle for edit profile
const handleToggleEditProfile = ()=>{
  SetAppHelpers(prevState => ({
    ...prevState,
    toggleforeditprofile: !prevState.toggleforeditprofile
  }));
} 
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/api/user/getuser/${id}`, {headers});
      setUserDetails(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();

}, [currentUser]);

  return (
    <div className="Profiledetails-Component">
      <div className="Profiledetails-Component-Top">
        <div className="PC-Imagecon">
          {
            userDetails?.coverimage === '' ? null :  <img
            src= {userDetails?.coverimage}
            alt="image"
          />
          }
          <div className="PC-Imagecon-Profile">
          {
            userDetails?.profileimage === '' ? <img
            src= "https://vectorified.com/images/guest-icon-3.png"
            alt="image"
          /> :  <img
            src= {userDetails?.profileimage}
            alt="image"
          />
          }
          </div>
        </div>
        <div className="PC-TOP-Container">
          <div className="PC-Editprofile">
            {
              currentUser?._id === id ?<button onClick={handleToggleEditProfile}>Edit Profile</button> : <button>Follow</button>
            }
          </div>
          <div className="PC-TOP-Namecon">
            <p>{userDetails?.name}</p>
            <p>@{userDetails?.username}</p>
          </div>
         {
           userDetails?.bio === '' ? null: <div className="PC-TOP-Biocon">
           <p>{userDetails?.bio}</p>
         </div>
         }
          <div className="PC-TOP-Followcon">
            <Link to= '/info/Following'>
              <p>{userDetails?.following.length}</p>
              <p>Following</p>
            </Link>
            <Link to="/info/Followers">
              <p>{userDetails?.followers.length}</p>
              <p>Followers</p>
            </Link>
          </div>
          <div className="PC-TOP-Options">
            <p onClick={() => ToggleOptionsFunc("posts")} className={ToggleOptions === "posts"? "PC-Active" :""}>Posts</p>
            <p onClick={() => ToggleOptionsFunc("reposts")} className={ToggleOptions === "reposts"? "PC-Active" :""}>Reposts</p>
            <p onClick={() => ToggleOptionsFunc("replies")} className={ToggleOptions === "replies"? "PC-Active" :""}>Replies</p>
            <p  onClick={() => ToggleOptionsFunc("likes")} className={ToggleOptions === "likes"? "PC-Active" :""}>Likes</p>
          </div>
        </div>
      </div>
      <div className="PC-Devider"></div>
    </div>
  );
}

export default Profiledetails;
