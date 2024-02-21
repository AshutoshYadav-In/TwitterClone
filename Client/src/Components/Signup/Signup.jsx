import React from 'react'
import { Link } from 'react-router-dom'
function Signup() {
  return (
    <div className='Sign-Component'>
<div className='Sign-Component-Left'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
    </div>
    <div className='Sign-Component-Right'>
        <form>
            <p>Sign Up</p>
            <div className='Form-Options'>
                <p>Fullname</p>
                <input name='fullname' placeholder='Enter name' type="text" />
             </div>
            <div className='Form-Options'>
                <p>Username</p>
                <input name='username' placeholder='Enter username' type="text" />
             </div>
             <div className='Form-Options'>
                <p>Email</p>
                <input name='email' placeholder='Enter email' type="text" />
             </div>
             <div className='Form-Options'>
                <p>Password</p>
                <input name='password'  placeholder='Enter password' type="password" />
             </div>
             <div className='Form-Options'>
                <p>Confirm Password</p>
                <input name='confirmpassword'  placeholder='Confirm password' type="password" />
             </div>
             <button>Login</button>
             <div className='Sign-Component-Right-Bottom'>
               <p> New to X ? </p> <Link to="/Signin">Sign In</Link>
             </div>
        </form>
    </div>

    </div>
  )
}

export default Signup