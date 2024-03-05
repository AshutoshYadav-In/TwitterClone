import React, { useState, useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from "axios"
import { signupSchema } from '../Helpers/Yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
function Signup() {
  const navigate = useNavigate();
    const {SetAppHelpers} = useContext(appContext);
    const[userDetails, setUserDetails]=useState({
      name:"",
      username:"",
      email:"",
      password:"",
      confirmpassword:""
   });
   //handle on change
   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserDetails(prevState => ({
          ...prevState,
          [name]: value
      }));
  };
   //yup validation
   const handleSubmit = async (e) => {
      e.preventDefault();
      const toggleLoading = ()=>{
        SetAppHelpers(prevState=>({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
          }))
      }
      try {
        toggleLoading();
          await signupSchema.validate(userDetails, { abortEarly: false });
          setUserDetails(prevState => ({
            ...prevState,
            errors: {} // clear the errors
        }));
        try{
            const response  = await axios.post(`${BASE_URL}/api/auth/signup` , userDetails);
          if(response.status === 201){
            toast.success(`${response.data.message}`);
            setUserDetails({
                name:"",
                username:"",
                email:"",
                password:"",
                confirmpassword:""
             });
             navigate('/signin');
          }
        }catch(error){
          if (error.response && error.response.status === 400) {
            toast.warn(`${error.response.data.message}`);
        } else {
            toast.error(`${error.response.data.message}`);
        }
        }
      } catch (errors) {
        console.log(errors)
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
  };
  return (
    <div className='Sign-Component'>
<div className='Sign-Component-Left'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
    </div>
    <div className='Sign-Component-Right'>
        <form onSubmit={handleSubmit}>
            <p>Sign Up</p>
            <div className='Form-Options'>
                <p>Fullname</p>
                <input name='name' value={userDetails.name} onChange={handleChange} placeholder='Enter name' type="text" />
                {userDetails.errors?.name && <p className="error">{userDetails.errors.name}</p>}
             </div>
            <div className='Form-Options'>
                <p>Username</p>
                <input name='username'  value={userDetails.username} onChange={handleChange} placeholder='Enter username' type="text" />
                {userDetails.errors?.username && <p className="error">{userDetails.errors.username}</p>}
             </div>
             <div className='Form-Options'>
                <p>Email</p>
                <input name='email'  value={userDetails.email} onChange={handleChange} placeholder='Enter email' type="text" />
                {userDetails.errors?.email && <p className="error">{userDetails.errors.email}</p>}
             </div>
             <div className='Form-Options'>
                <p>Password</p>
                <input name='password' value={userDetails.password} onChange={handleChange}  placeholder='Enter password' type="password" />
                {userDetails.errors?.password && <p className="error">{userDetails.errors.password}</p>}
             </div>
             <div className='Form-Options'>
                <p>Confirm Password</p>
                <input name='confirmpassword' value={userDetails.confirmpassword} onChange={handleChange}    placeholder='Confirm password' type="password" />
                {userDetails.errors?.confirmpassword && <p className="error">{userDetails.errors.confirmpassword}</p>}
             </div>
             <button type='submit'>Sign Up</button>
             <div className='Sign-Component-Right-Bottom'>
               <p> New to X ? </p> <Link to="/Signin">Sign In</Link>
             </div>
        </form>
    </div>

    </div>
  )
}

export default Signup