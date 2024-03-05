import React, { useState,useContext } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from "axios"
import { BASE_URL } from '../Helpers/Base_Url'
import './Sign.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { signinSchema } from '../Helpers/Yup';
function Signin() {
  const navigate = useNavigate();
  const {SetAppHelpers} = useContext(appContext);
  const[userDetails,setUserDetails]=useState({
    email:"",
    password:""
  });
  //on input change
  const onInputChange = (e)=>{
    const { name, value } = e.target;
      setUserDetails(prevState => ({
          ...prevState,
          [name]: value
      }));
  }
  //on submit
  const formSubmit= async(e)=>{
    e.preventDefault();
    const toggleLoading = ()=>{
      SetAppHelpers(prevState=>({
        ...prevState,
        toggleforloading: !prevState.toggleforloading
      }));
    }
    try {
      toggleLoading();
        await signinSchema.validate(userDetails, { abortEarly: false });
        setUserDetails(prevState => ({
          ...prevState,
          errors: {} // clear the errors
      }));
      try{
       const response = await axios.post(`${BASE_URL}/api/auth/signin` , userDetails);
       if(response.status === 200){
        toast.success(`${response.data.message}`);
        setUserDetails({
            email:"",
            password:"",
         });
         const user = JSON.stringify(response.data.userDetails.user);
         sessionStorage.setItem("user", user);
         sessionStorage.setItem('token', response.data.userDetails.token);
         navigate('/home');
      }
      }catch(error){
if (error.response && error.response.status === 400) {
            toast.warn(`${error.response.data.message}`);
        } else {
            toast.error(`${error.response.data.message}`);
        }
      }
    } catch (errors) {
       const validationErrors = {};
       errors.inner.forEach((error) => {
           validationErrors[error.path] = error.message;
       });
       setUserDetails(prevState => ({
           ...prevState,
           errors: validationErrors
       }));
    }finally{
      toggleLoading();
    }
  }
  return (
    <div className='Sign-Component'>
    <div className='Sign-Component-Left'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
    </div>
    <div className='Sign-Component-Right'>
        <form onSubmit={formSubmit}>
            <p>Sign In</p>
             <div className='Form-Options'>
                <p>Email</p>
                <input name='email' onChange={onInputChange}
                value= {userDetails.email} placeholder='Enter email' type="text" />
                    {userDetails.errors?.email && <p className="error">{userDetails.errors.email}</p>}
             </div>
             <div className='Form-Options'>
                <p>Password</p>
                <input name='password' onChange={onInputChange}
                value= {userDetails.password}  placeholder='Enter password' type="password" />
                       {userDetails.errors?.password && <p className="error">{userDetails.errors.password}</p>}
             </div>
             <button type='submit'>Login</button>
             <div className='Sign-Component-Right-Bottom'>
               <p> New to X ? </p>
               <Link to="/Signup">Sign Up</Link>
             </div>
        </form>
    </div>
    </div>
  )
}

export default Signin