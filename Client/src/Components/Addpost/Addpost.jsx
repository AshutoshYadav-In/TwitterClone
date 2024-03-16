import React from 'react'
import './Addpost.css'
import { useRef, useState,useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { BASE_URL } from '../Helpers/Base_Url.js';
import { appContext } from '../../App';
import { tweetValidationSchema } from '../Helpers/Yup.js';
function Addpost() {

    const {AppHelpers, SetAppHelpers,currentUser} = useContext(appContext);
    const [userDetails, setUserDetails] = useState({
        tweetText: "",
    });
    //handle add post  toggle 
    const handleAddpostToggle = ()=>{
      SetAppHelpers(prevState => ({
        ...prevState,
        toggleforaddpost: !prevState.toggleforaddpost
      }));
    } 

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
     // handle inout change
    const handleTextChange = (e) => {
        setUserDetails({
            ...userDetails,
            tweetText: e.target.value
        });
    };
//handle submit
const handleSubmit = async (e) => {
    e.preventDefault();
    const toggleLoading = () => {
        SetAppHelpers(prevState => ({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
        }))
    };
    try {
        await tweetValidationSchema.validate(userDetails, { abortEarly: false });
        try {
            toggleLoading();
            const formData = new FormData;
            formData.append("tweetText", userDetails.tweetText)
            formData.append("image", ImageState.file);
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/api/user/posttweet/${AppHelpers.tweetvalue}` , formData , {headers});
            if(response.status === 201){
                toast.success(`${response.data.message}`);
                setUserDetails({
                    tweetText: ""
                });
                SetImageState({
                    preview: '',
                    file: null
                });
                toggleLoading();
                handleAddpostToggle()
            }
            SetAppHelpers(prevState => ({
                ...prevState,
                 toggleforreload: !prevState.toggleforreload
              }));
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warn(`${error.response.data.message}`);
            } else {
                toast.error(`${error.response.data.message}`);
            }
            toggleLoading();
        }
    }
    catch (errors) {
        const validationErrors = {};
        errors.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setUserDetails(prevState => ({
          ...prevState,
          errors: validationErrors
        }));
    }
}
    return (
        <div className= {AppHelpers.toggleforaddpost? "Addpost-Component-Show Addpost-Component" :"Addpost-Component"}>
             <FontAwesomeIcon icon={faX} style={{ color: "#e7e9ea", }} onClick={handleAddpostToggle}/>
             <form className='Home-Component-WriteTweet' onSubmit={handleSubmit} style={{border:"none"}}>
                    <div className='Home-Component-WriteTweet-Left'>
                        <div>
                        {
                currentUser?.profileimage === '' ? <img
                  src="https://vectorified.com/images/guest-icon-3.png"
                  alt="image"
                /> : <img
                  src={currentUser?.profileimage}
                  alt="image"
                />
              }
                        </div>
                    </div>
                    <div className='Home-Component-WriteTweet-Right'>
                        <TextareaAutosize placeholder='Type Something!' spellCheck="false" value={userDetails.tweetText}
                            onChange={handleTextChange} />
                               {userDetails.errors?.tweetText && <p className="error" style={{ color: 'var(--error)', fontSize: '0.7rem' }}>{userDetails.errors.tweetText}</p>}
                        {ImageState.preview !== "" && <div className='Home-Component-WriteTweet-Right-Imagecon'>
                            <FontAwesomeIcon icon={faX} style={{ color: "#e7e9ea", }} onClick={handleImageRemove} />
                            {ImageState.preview && <img src={ImageState.preview} alt="Selected" />}
                        </div>}
                        <div className='Home-Component-Buttons-Con'>
                            <label onClick={handleImageClick}>
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                            <button type='submit'>Post</button>
                        </div>
                    </div>
                    <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                </form>

        </div>
    )
}

export default Addpost