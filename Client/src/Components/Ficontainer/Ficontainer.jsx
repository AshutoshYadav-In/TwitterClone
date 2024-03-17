import { React, useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Ficontainer.css'
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
import Topnav from '../Topnav/Topnav'
import Users from '../Users/Users'
function Ficontainer() {
  const { SetAppHelpers, currentUser } = useContext(appContext);
  const { id, infotype } = useParams();
  const [followInfo, setFollowInfo] = useState();
  const [valueforrefresh, setValueForRefresh] = useState(true);
  //handle loading toggle 
  const handleLoading = () => {
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforloading: !prevState.toggleforloading
    }));
  }
  //handle follower info
  useEffect(() => {
    const FollowerInfo = async () => {
      try {
        handleLoading();
        const token = sessionStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
        };
        const response = await axios.get(`${BASE_URL}/api/user/followinfo/${id}`, { headers });
        if (response.status === 200) {
          handleLoading();
        }
        setFollowInfo(response.data)
      } catch (error) {
        toast.error(`${error.response.data.message}`)
        handleLoading();
      }
    }
    FollowerInfo();
  }, [id,valueforrefresh])
  return (
    <div className='Ficontainer-Component'>
      <Topnav toggle={"name"} name={infotype} />
      <div className='FIC-Users-Container'>
        {followInfo && followInfo[infotype.toLowerCase()]?.length > 0 ?
        followInfo[infotype.toLowerCase()].map((info,index)=>
        <Users info = {info} key={index} valueforrefresh={valueforrefresh} setValueForRefresh={setValueForRefresh} /> 
        )
          :
          <div className='NDA'>No data available</div>
        }
      </div>
    </div>
  )
}

export default Ficontainer