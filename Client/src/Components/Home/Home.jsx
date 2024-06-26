import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header';
import { React, useEffect, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useContext } from 'react';
import Tweet from '../Tweet/Tweet.jsx';
import axios from "axios"
import { appContext } from '../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { tweetValidationSchema } from '../Helpers/Yup.js';
import { BASE_URL } from '../Helpers/Base_Url.js';
function Home() {
    const inputRef = useRef(null);
    const { SetAppHelpers, currentUser, AppHelpers } = useContext(appContext);
    const [tweets, setTweets] = useState([]);
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
    //handle loading
    const toggleLoading = () => {
        SetAppHelpers(prevState => ({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
        }))
    };
    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                const response = await axios.post(`${BASE_URL}/api/user/posttweet/none`, formData, { headers });
                if (response.status === 201) {
                    toast.success(`${response.data.message}`);
                    setUserDetails({
                        tweetText: ""
                    });
                    SetImageState({
                        preview: '',
                        file: null
                    });
                    toggleLoading();
                    SetAppHelpers(prevState => ({
                        ...prevState,
                        toggleforalltweets: !prevState.toggleforalltweets
                    }));
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
    //fetch all tweets 
    const fetchTweets = async () => {
        try {
            toggleLoading();
            const response = await axios.get(`${BASE_URL}/api/user/alltweets`);
            if (response.status === 200) {
                toggleLoading();
            }
            setTweets(response.data);
        } catch (error) {
            toggleLoading();
        }
    }

    useEffect(() => {
        fetchTweets();
    }, [AppHelpers.toggleforalltweets])
    return (
        <div className='Home-Component'>
            <Sidebar />
            <div className='Home-Component-Content'>
                <Header />
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
            
                    {
                        tweets?.length > 0 ? (
                            tweets.map((tweet, index) => (
                                <Tweet key={index} tweet={tweet} type={"posts"} />
                            ))
                        ) : (
                            <div className='NDA'> Nothing to see here! </div>
                        )
                    }

            </div>
        </div>
    )
}

export default Home