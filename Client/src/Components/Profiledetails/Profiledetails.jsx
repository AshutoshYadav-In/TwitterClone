import  {React, useState,useContext, useEffect,useCallback } from "react";
import "./Profiledetails.css";
import { Link,useParams } from "react-router-dom";
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
function Profiledetails(props) {
  const{id} = useParams()
  const {SetAppHelpers,currentUser} = useContext(appContext);
  const[userDetails,setUserDetails] =useState();
  const[followInfo,setFollowInfo] =useState();
  const[ToggleOptions, SetToggleOptions] = useState('posts');
       //function for options(post,replies,likes)
       const ToggleOptionsFunc = (e)=> {
      SetToggleOptions(e)
    }
  
    //handle loading toggle 
    const handleLoading = ()=>{
      SetAppHelpers(prevState => ({
        ...prevState,
        toggleforloading: !prevState.toggleforloading
      }));
    } 

    useEffect(() => {
      if (ToggleOptions !== props.tweetType) {
         props.SetTweetType(ToggleOptions);
      }
     }, [ToggleOptions, props.tweetType]);
     
       //toggle for edit profile
const handleToggleEditProfile = ()=>{
  SetAppHelpers(prevState => ({
    ...prevState,
    toggleforeditprofile: !prevState.toggleforeditprofile
  }));
} 

// calling fetch data
const fetchData = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.get(`${BASE_URL}/api/user/getuser/${id}`, {headers});
    setUserDetails(response.data.user);
  } catch (error) {
    
  }
};
useEffect(() => {
  fetchData();
}, [currentUser,id]);

//fetch follow function 
const getFollowInfo = async()=>{
  try{
    handleLoading();
    const token = sessionStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.get(`${BASE_URL}/api/user/followinfo/${id}` , {headers});
    if(response.status===200){
     handleLoading();
    }
    setFollowInfo(response.data)
  }catch(error){
    toast.error(`${error.response.data.message}`)
    handleLoading();
  }
  }
useEffect(()=>{
getFollowInfo();
},[])

//handle follow reload
const handleFollowReload = () => {
  SetAppHelpers(prevState => ({
      ...prevState,
      toggleforfollowreload: !prevState.toggleforfollowreload
  }));
}

//follow toggle
const followToggle = async()=>{
  try{
    handleLoading();
    const token = sessionStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.get(`${BASE_URL}/api/user/follow/${id}`, {headers});
    if(response.status === 200){
     handleLoading();
     getFollowInfo();
     fetchData();
     handleFollowReload();
    }
  }catch(error){ 

  handleLoading()    
  }
}
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
              currentUser?._id === id ?<button onClick={handleToggleEditProfile}>Edit Profile</button> : <button onClick={followToggle}>{followInfo?.followers?.some(user => user._id === currentUser._id)? "Unfollow" : "Follow"}</button>
            }
          </div>
          <div className="PC-TOP-Namecon">
            <p>{userDetails?.name || "Name"}</p>
            <p>@{userDetails?.username || "username"}</p>
          </div>
         {
           userDetails?.bio === '' ? null: <div className="PC-TOP-Biocon">
           <p>{userDetails?.bio || "Bio"}</p>
         </div>
         }
          <div className="PC-TOP-Followcon">
            <Link to= {`/${id}/Following`}>
              <p>{userDetails?.following.length}</p>
              <p>Following</p>
            </Link>
            <Link to= {`/${id}/Followers`}>
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
