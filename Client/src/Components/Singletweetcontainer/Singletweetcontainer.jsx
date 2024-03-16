import React from 'react'
import './Singletweetcontainer.css'
import Topnav from '../Topnav/Topnav'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Helpers/Base_Url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tweet from '../Tweet/Tweet'
import { useState,useRef,useContext,useEffect } from 'react'
import { appContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { tweetValidationSchema } from '../Helpers/Yup';
import TextareaAutosize from 'react-textarea-autosize';
function Singletweetcontainer() {
    const { AppHelpers, SetAppHelpers, currentUser } = useContext(appContext);
    const[tweet,SetTweet] = useState()
    const[trigger,setTrigger] = useState(true)
    const {id} = useParams();
    const inputRef = useRef(null)
    const [userDetails, setUserDetails] = useState({
        tweetText: "",
    });
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
    //handle text change 
    const handleTextChange = (e) => {
        setUserDetails({
            ...userDetails,
            tweetText: e.target.value
        });
    };


    //Handle image removal
    const handleImageRemove = () => {
        SetImageState({
            preview: '',
            file: null
        })
    }

    //handle focus on textarea 
    useEffect(() => {
        const inputElement = document.querySelector('.STC-Textarea');
        if (inputElement) {
          inputElement.focus();
        }
      }, []);
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
                const response = await axios.post(`${BASE_URL}/api/user/comment/${id}` , formData , {headers});
                if(response.status === 201){
                  setTrigger(!trigger)
                    toast.success(`${response.data.message}`);
                    setUserDetails({
                        tweetText: ""
                    });
                    SetImageState({
                        preview: '',
                        file: null
                    });
                    toggleLoading();
                }
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

    //tweet fetch
    useEffect(() => {
        if(!id){
            return
        }
        const handleLoading = () => {
          SetAppHelpers(prevState => ({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
          }));
        };
    
        const handleTweetFetch = async () => {
          try {
            handleLoading();
            const response = await axios.get(`${BASE_URL}/api/user/tweet/${id}`);
            if (response.status === 200) {
              handleLoading();
              SetTweet([response.data]);
            }
          } catch (error) {
            handleLoading();
            console.error('Error fetching tweet:', error);
          }
        };
    
        handleTweetFetch();
      }, [id,trigger,AppHelpers?.toggleforreload]); 

  return (
    <div className='Singletweetcontainer-Component'>
      <Topnav  toggle = {"name"} name= {"Post"}/>
      {
       tweet?.length > 0 && tweet.map((tweet,index)=>(
        <Tweet  key={index} tweet={tweet} type ={"posts"}  />
       ))
      }
        <form className='Home-Component-WriteTweet' onSubmit={handleSubmit}>
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
                        <TextareaAutosize placeholder='Type Something!' className='STC-Textarea' spellCheck="false" value={userDetails.tweetText}
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
                {
       tweet?.length > 0 && tweet.map((tweet,index)=>(
        <Tweet key={index} tweet={tweet} type ={"singletweet"}  />
       ))
      }
    </div>
  )
}

export default Singletweetcontainer