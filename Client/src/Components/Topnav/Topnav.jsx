import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Topnav.css'
function Topnav(props) {
  return (
    <div className='Topnav-Component'>
        <FontAwesomeIcon icon={faArrowLeft} style={{color: "#e7e9ea",}} />
         {
            props.toggle == "name"? <p>Ashutosh Yadav</p> :       <input type="text" placeholder='Search X' />
         }
    </div>
  )
}

export default Topnav