import React from 'react'
import './Singletweet.css'
import Sidebar from '../Sidebar/Sidebar'
import Singletweetcontainer from '../Singletweetcontainer/Singletweetcontainer'
function Singletweet() {
  return (
    <div className='Singletweet-Component'>
        <Sidebar/>
        <Singletweetcontainer/>
    </div>
  )
}

export default Singletweet