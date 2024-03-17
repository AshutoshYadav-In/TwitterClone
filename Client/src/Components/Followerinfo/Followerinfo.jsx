import { React, useEffect,useContext,useState } from 'react'
import './Followerinfo.css'
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../Helpers/Base_Url';
import Sidebar from '../Sidebar/Sidebar'
import Ficontainer from '../Ficontainer/Ficontainer'
function Followerinfo() {
  return (
    <div className='Followerinfo-Component'>
      <Sidebar />
     <Ficontainer/>
    </div>
  )
}

export default Followerinfo