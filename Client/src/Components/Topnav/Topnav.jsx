import React from 'react'
import { useEffect, useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash/debounce';
import './Topnav.css'
function Topnav({toggle, name , search , SetSearch}) {
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

  //debouncing 
  const handleSearchDebounce = (text) => {
    deb(text);
  };
  const deb = useCallback(
    debounce((text) => {
      SetSearch(text);
    }, 500),
    []
  );
  return (
    <div className='Topnav-Component'>
      <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#e7e9ea", }} onClick={handleBackButtonClick}  />
      {
        toggle == "name" ? <p>{name}</p> : <input type="text" onChange={(e)=> handleSearchDebounce(e.target.value)} placeholder='Search X' />
      }
    </div>
  )
}

export default Topnav