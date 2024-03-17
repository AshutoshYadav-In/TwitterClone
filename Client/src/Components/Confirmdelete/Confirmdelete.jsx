import {React,useContext} from 'react'
import './Confirmdelete.css'
import axios from 'axios';
import { appContext } from '../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helpers/Base_Url';
function Confirmdelete() {
    const { AppHelpers,SetAppHelpers} = useContext(appContext);
    
    //handle cancel
   const handleCancel = ()=> {
    SetAppHelpers(prevState => ({
        ...prevState,
        togglefordeletion: !prevState.togglefordeletion,
        tweetdeletedetails:{
            id:"",
            type:""
        }
      }));
   }
   //handle delete
   const handleDelete= async()=>{
    const handleLoading = ()=>{
        SetAppHelpers(prevState => ({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
          }));
    }
    try{
    handleLoading();
    const token = sessionStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.delete(`${BASE_URL}/api/user/${AppHelpers.tweetdeletedetails.type}/${AppHelpers.tweetdeletedetails.id}`,{headers})
    if(response.status === 200){
   toast.success(`${response.data.message}`);
   SetAppHelpers(prevState => ({
    ...prevState,
    toggleforreload: !prevState.toggleforreload,
    toggleforalltweets: !prevState.toggleforalltweets
  }));
   handleLoading();
   handleCancel();
    }
    }catch(error){
        handleLoading();
        handleCancel();
        toast.error(`${error.response.data.message}`);
    }
   }


  return (
    <div className={AppHelpers.togglefordeletion? "CD-Component" :"CD-Component-Toggle"}>
        <p>Confirm deletion?</p>
        <div>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleDelete}>Confirm</button>
        </div>
    </div>
  )
}

export default Confirmdelete