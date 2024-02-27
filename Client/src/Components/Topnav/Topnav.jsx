import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Topnav.css'
function Topnav(props) {
  const Navigate = useNavigate();
  //Back navigation
  const handleBackButtonClick = () => {
  Navigate(-1)
  };

//Useffect to set search bar on focus
  useEffect(() => {
    const inputElement = document.querySelector('.Topnav-Component input[type="text"]');
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className='Topnav-Component'>
      <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#e7e9ea", }} onClick={handleBackButtonClick}  />
      {
        props.toggle == "name" ? <p>{props.info}</p> : <input type="text" placeholder='Search X' />
      }
    </div>
  )
}

export default Topnav