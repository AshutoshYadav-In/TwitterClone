import React from 'react'
import './Profilecontent.css'
import Topnav from '../Topnav/Topnav'
import Profiledetails from '../Profiledetails/Profiledetails'
import Tweet from '../Tweet/Tweet'
function Profilecontent() {
  return (
    <div className='Profilecontent-Component'>
   <Topnav toggle = {"name"}/>
   <Profiledetails/>
   <Tweet/>
    </div>
  )
}

export default Profilecontent