import React from 'react'
import { useParams } from 'react-router-dom'
import './Ficontainer.css'
import Topnav from '../Topnav/Topnav'
import Users from '../Users/Users'
function Ficontainer() {
  const { infotype } = useParams();
  return (
    <div className='Ficontainer-Component'>
    <Topnav toggle={"name"} info = {infotype} />
    <div className='FIC-Users-Container'>
        <Users/>
    </div>
    </div>
  )
}

export default Ficontainer