import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header';
import React from 'react'
import Tweet from '../Tweet/Tweet.jsx';
import './Home.css'
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextareaAutosize from 'react-textarea-autosize';
function Home() {
    const inputRef = useRef(null);
    const [ImageState, SetImageState] = useState({
        preview: '',
        file: null
    });
    //Handles input reference
    const handleImageClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    //Handles file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            SetImageState({
                preview: URL.createObjectURL(file),
                file: file
            });
        }
    };
    //Handle image removal
    const handleImageRemove = ()=>{
        SetImageState({
            preview: '',
            file: null
        })
    }
    return (
        <div className='Home-Component'>
            <Sidebar />
            <div className='Home-Component-Content'>
                <Header/>
                <form className='Home-Component-WriteTweet'>
                    <div className='Home-Component-WriteTweet-Left'>
                        <div>
                            <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706339303/Nextcartassets/l2ar6zznkqmqxorjben5.jpg" alt="" />
                        </div>
                    </div>
                    <div className='Home-Component-WriteTweet-Right'>
                        <TextareaAutosize placeholder='Type Something!' id='' />
                        <div className='Home-Component-WriteTweet-Right-Imagecon'>
                        <FontAwesomeIcon icon={faX} style={{color: "#e7e9ea",}} onClick={handleImageRemove}/>
                            {ImageState.preview && <img src={ImageState.preview} alt="Selected" />}
                        </div>
                        <div>
                            <label onClick={handleImageClick}>
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                            <button>Post</button>
                        </div>
                    </div>
                    <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                </form>
                <Tweet></Tweet>
            </div>
        </div>
    )
}

export default Home