import { React, useContext, useEffect, useState } from 'react';
import './Profilecontent.css'
import Topnav from '../Topnav/Topnav'
import Profiledetails from '../Profiledetails/Profiledetails'
import Tweet from '../Tweet/Tweet'
import { appContext } from '../../App';
import axios from 'axios';
import { BASE_URL } from '../Helpers/Base_Url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
function Profilecontent() {
  const { AppHelpers, SetAppHelpers, currentUser } = useContext(appContext);
  const[tweetType,SetTweetType] =useState();
  const[user,setUser]= useState();
  const[tweetData,SetTweetData] = useState();
  const {id} = useParams();
  useEffect(()=>{
    if(!tweetType){
      return
    }
    const getData = async()=>{
      const toggleLoading = ()=>{
        SetAppHelpers(prevState=>({
          ...prevState,
          toggleforloading: !prevState.toggleforloading
        }));
      }
      try{
        toggleLoading();
        const token = sessionStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        const response = await axios.get(`${BASE_URL}/api/user/gettweet/${id}/${tweetType}`, {headers});
        SetTweetData(response.data);
      }catch(error){
        toast.warn(`${error.response.data.message}`);
      }finally{
        toggleLoading();
      }
    }
    getData();
  },[tweetType,AppHelpers.toggleforreload,id]);
   
  //get user
  useEffect(()=>{
  const getUser= async()=>{
    try{
     const response = await axios.get(`${BASE_URL}/api/user/user/${id}`);
     if(response.status ===200){
      setUser(response.data)
     }
    }catch(error){
      toast.error(`${error.response.data.message}`);
    }
  }
getUser();
  },[id])
  return (
    <div className='Profilecontent-Component'>
   <Topnav toggle = {"name"} name= {user?.name}/>
   <Profiledetails SetTweetType= {SetTweetType}/>
  { tweetData?.tweets.length >0 ?
   tweetData?.tweets.map((tweet,index) => (
        <Tweet key={index} tweet={tweet} type={tweetType} />
      )) : <div className='NDA'>No data available</div>}
    </div>
  )
}

export default Profilecontent