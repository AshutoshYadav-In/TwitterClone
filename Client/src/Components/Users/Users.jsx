import { React, useContext, useEffect, useState } from 'react'
import './Users.css'
import { Link, useParams } from "react-router-dom";
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
function Users({ info, valueforrefresh,type, setValueForRefresh }) {
    const { id } = useParams();
    const[followInfo,setFollowInfo] =useState();
    const { SetAppHelpers, currentUser } = useContext(appContext);

    //handle loading toggle 
    const handleLoading = () => {
        SetAppHelpers(prevState => ({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
        }));
    }

    //handle reload for fololow
    const handleFollowReload = () => {
        SetAppHelpers(prevState => ({
            ...prevState,
            toggleforfollowreload: !prevState.toggleforfollowreload
        }));
    }
    //follow toggle
    const followToggle = async (infoid) => {
        try {
            handleLoading();
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/api/user/follow/${infoid}`, { headers });
            if (response.status === 200) {
                handleLoading();
                if(type !== "search"){
                    setValueForRefresh(!valueforrefresh);
                }
                handleFollowReload();
                getFollowInfo()
            }
        } catch (error) {
            handleLoading();
          if(`${error.response.data.message === "Can't follow yourself"}`){
            toast.warning(`${error.response.data.message}`)
          }
          else{
            toast.error(`${error.response.data.message}`)
          }
        }
    }

    //fetch follow function 
const getFollowInfo = async()=>{
    try{
      const token = sessionStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/api/user/followinfo/${type === "search" ? currentUser._id : id}` , {headers});
      if(response.status===200){
      }
      setFollowInfo(response.data)
    }catch(error){
      toast.error(`${error.response.data.message}`)
    }
    }
  useEffect(()=>{
  getFollowInfo();
  },[])
    return (
        <div className='Users-Component'>
            <Link to= {`/profile/${info?._id}`} >
                <div className='UC-Imagecon'>
                    {
                        info?.profileimage === '' ? <img
                            src="https://vectorified.com/images/guest-icon-3.png"
                            alt="image"
                        /> : <img
                            src={info?.profileimage}
                            alt="image"
                        />
                    }
                </div>
                <div>
                    <p>{info?.name}</p>
                    <p>{info?.username}</p>
                </div>
            </Link>
            <button onClick={() => followToggle(info?._id)}>{followInfo?.following?.some(user=> user._id === info?._id)? "Unfollow": "Follow"}</button>
        </div>
    )
}

export default Users