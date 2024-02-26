import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Profilecontent from '../ProfileContent/Profilecontent';
import './Profile.css'
function Profile() {
    return (
        <div className='Profile-Component'>
            <Sidebar />
            <Profilecontent/>
        </div>
    )
}

export default Profile