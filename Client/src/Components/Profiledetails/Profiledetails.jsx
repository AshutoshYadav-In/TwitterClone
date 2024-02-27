import React, { useState } from "react";
import "./Profiledetails.css";
import { Link } from "react-router-dom";
function Profiledetails() {
  const[ToggleOptions, SetToggleOptions] = useState('posts');
       //function for options(post,replies,likes)
       const ToggleOptionsFunc = (e)=> {
      SetToggleOptions(e)
       }
  return (
    <div className="Profiledetails-Component">
      <div className="Profiledetails-Component-Top">
        <div className="PC-Imagecon">
          <img
            src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706336711/Nextcartassets/y8bcwmslbwnht27fiver.png"
            alt="image"
          />
          <div className="PC-Imagecon-Profile">
            <img
              src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706339303/Nextcartassets/l2ar6zznkqmqxorjben5.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="PC-TOP-Container">
          <div className="PC-Editprofile">
            <button>Edit Profile</button>
          </div>
          <div className="PC-TOP-Namecon">
            <p>Ashutosh Yadav</p>
            <p>@ashop123</p>
          </div>
          <div className="PC-TOP-Biocon">
            <p>Vfx Artist || Frontned Web Developer</p>
          </div>
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
