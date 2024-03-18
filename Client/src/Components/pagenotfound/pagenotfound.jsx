import React from 'react'
import './Pagenotfound.css'
import { Link} from "react-router-dom";
function Pagenotfound() {
  return (
    <div className='Pagenotfound-Component'>
    <div className='Pagenotfound-Imagecon'>
        <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706336624/Nextcartassets/gw3wtw8jvirlrfxy8ji9.jpg" alt="image" />
    </div>
    <Link to='/Home'>
    <button>Go back to homepage</button>
    </Link>
    </div>
  )
}

export default Pagenotfound