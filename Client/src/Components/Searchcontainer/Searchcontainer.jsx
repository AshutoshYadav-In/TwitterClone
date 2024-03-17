import React from 'react'
import './Searchcontainer.css'
import Topnav from '../Topnav/Topnav'
import Users from '../Users/Users'
function Searchcontainer() {
    return (
        <div className='Searchcontainer-Component'>
            <Topnav toggle={"Search"} />
            <div className='Users-Container'>
                {/* <Users /> */}
            </div>

        </div>
    )
}

export default Searchcontainer