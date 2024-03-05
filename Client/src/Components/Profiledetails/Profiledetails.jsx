import React, { useState,useContext } from "react";
import "./Profiledetails.css";
import { Link } from "react-router-dom";
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
function Profiledetails() {
  const {SetAppHelpers,currentUser} = useContext(appContext);
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
  return (
    <div className="Profiledetails-Component">
      <div className="Profiledetails-Component-Top">
        <div className="PC-Imagecon">
          {
            currentUser?.coverimage === '' ? null :  <img
            src= {currentUser?.coverimage}
            alt="image"
          />
          }
          <div className="PC-Imagecon-Profile">
          {
            currentUser?.profileimage === '' ? <img
            src= "https://vectorified.com/images/guest-icon-3.png"
            alt="image"
          /> :  <img
            src= {currentUser?.profileimage}
            alt="image"
          />
          }
          </div>
        </div>
        <div className="PC-TOP-Container">
          <div className="PC-Editprofile">
            <button onClick={handleToggleEditProfile}>Edit Profile</button>
          </div>
          <div className="PC-TOP-Namecon">
            <p>{currentUser?.name}</p>
            <p>@{currentUser?.username}</p>
          </div>
         {
           currentUser?.bio === '' ? null:   <div className="PC-TOP-Biocon">
           <p>{currentUser?.bio}</p>
         </div>
         }
          <div className="PC-TOP-Followcon">
            <Link to= '/info/Following'>
              <p>23</p>
              <p>Following</p>
            </Link>
            <Link to="/info/Followers">
              <p>36</p>
              <p>Followers</p>
            </Link>
          </div>
          <div className="PC-TOP-Options">
            <p onClick={() => ToggleOptionsFunc("posts")} className={ToggleOptions === "posts"? "PC-Active" :""}>Posts</p>
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
