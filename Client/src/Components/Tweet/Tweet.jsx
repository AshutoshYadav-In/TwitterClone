import React from 'react'
import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams } from 'react-router-dom'
import { appContext } from '../../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helpers/Base_Url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faRetweet, faPen, faX } from '@fortawesome/free-solid-svg-icons';
import './Tweet.css'
function Tweet({ tweet, type,setLat,lat }) {
  const { id } = useParams();
  const { currentUser, AppHelpers, SetAppHelpers } = useContext(appContext);
  const [retweetToggle, setRetweetToggle] = useState({
    togglefortop: false,
    toggleforbottom: false
  });
  //retweet toggle 
  const toggle = (type) => {
    setRetweetToggle((prevState) => ({
      ...prevState,
      [`togglefor${type}`]: !prevState[`togglefor${type}`],
    }));
  };
  // Function to format post time
  const formatPostTime = (time) => {
    const now = new Date();
    const postTime = new Date(time);
    const diff = Math.floor((now - postTime) / 1000);

    if (diff < 60) {
      return 'just now';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes}m ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours}h ago`;
    } else if (diff < 2592000) {
      const days = Math.floor(diff / 86400);
      return `${days}d ago`;
    } else {
      const months = Math.floor(diff / 2592000);
      return `${months} M ago`;
    }
  };
//handle all tweets loading
function handleLat (){
  SetAppHelpers(prevState => ({
    ...prevState,
    toggleforalltweets: !prevState.toggleforalltweets
  }));
}

// handle loading
  const handleLoading = () => {
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforloading: !prevState.toggleforloading
    }));
  }
  //Add repost or quote function
  const repostQuoteCommentLike = async (tweetId, type) => {
    if (type === "posttweet") {
      SetAppHelpers(prevState => ({
        ...prevState,
        toggleforaddpost: !prevState.toggleforaddpost,
        tweetvalue: tweetId
      }));
      setRetweetToggle({
        togglefortop: false,
        toggleforbottom: false
      });
      return;
    }
    const handleReload = () => {
      SetAppHelpers(prevState => ({
        ...prevState,
        toggleforreload: !prevState.toggleforreload
      }));
    }
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      handleLoading();
      const response = await axios.get(`${BASE_URL}/api/user/${type}/${tweetId}`, { headers })
      if (response.status === 200) {
        toast.success(`${response.data.message}`);
        handleLoading();
        handleReload();
        handleLat();
        setRetweetToggle({
          togglefortop: false,
          toggleforbottom: false
        });

      }
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      handleLoading();
      handleReload();
    }
  };

//handle delete click
const handleDelete = (id,type)=>{
  SetAppHelpers(prevState => ({
    ...prevState,
    togglefordeletion: !prevState.togglefordeletion,
    tweetdeletedetails:{
      id: id,
      type: type
    }
  }));
}

  return (
    ((type === "singletweet" && !(tweet?.comments?.length > 0)) ? null :
    <div className='Tweet-Component'>
      {
        type == "reposts" && type !== "singletweet"&&
        <div className='Tweet-Component-Repost'>
          <FontAwesomeIcon icon={faRetweet} />
          <p>{id === currentUser?._id ? "You reposted" : tweet?.user.name}</p>
        </div>
      }
      { type !== "singletweet" &&
      <div className='Tweet-Component-Container'>
        <div className='Tweet-Component-Imagecon'>
          <div>
            <Link to={`/profile/${tweet?.user._id}`}>
            {
              tweet?.user.profileimage === '' ? <img
              src="https://vectorified.com/images/guest-icon-3.png"
              alt="image"
              /> : <img
              src={tweet?.user.profileimage}
              alt="image"
              />
            }
            </Link>
          </div>
        </div>
        <div className={type === "replies" ? 'Tweet-Component-Header TCH-After ' : 'Tweet-Component-Header'}>
          <div className='Tweet-Component-Header-Divider'>
            <div className='Tweet-Component-Header-Divider-Two'>
              <div>
                <Link to={`/profile/${tweet?.user._id}`}>{tweet?.user.name}</Link>
                <p>{formatPostTime(tweet?.createdAt)}</p>
              </div>
              {
                tweet?.user._id === currentUser?._id &&
                <FontAwesomeIcon icon={faTrashCan} onClick={()=>handleDelete(tweet?._id , "deletetweet")} />
              }
            </div>
            <Link to={`/tweet/${tweet?._id}`}>{tweet?.text}</Link>
          </div>
          {
            tweet?.image !== "" &&
            <div className='Tweet-Component-Postimage'>
              <img src={tweet?.image} alt="" />
            </div>
          }
          {
            tweet?.quotefor.length > 0  && type !== "singletweet" &&
            <Link to={`/tweet/${tweet?.quotefor[0]._id}`} className='Tweet-Component-For-Replies'  >
              <div className='Tweet-Component-For-Replies-Top'>
                <div>
                  {
                    tweet?.quotefor[0].user.profileimage === '' ? <img
                      src="https://vectorified.com/images/guest-icon-3.png"
                      alt="image"
                    /> : <img
                      src={tweet?.quotefor[0].user.profileimage}
                      alt="image"
                    />
                  }
                </div>
                <p>
                  {tweet?.quotefor[0].user.name}
                </p>
                <p>{formatPostTime(tweet?.quotefor[0]?.createdAt)}</p>
              </div>
              <div className='Tweet-Component-For-Replies-Bottom'>
                <p>{tweet?.quotefor[0].text}</p>
                {
                  tweet?.quotefor[0].image !== "" &&
                  <div>
                    <img src={tweet?.quotefor[0].image} alt="" />
                  </div>
                }
              </div>
            </Link>
          }
          <div className='Tweet-Component-Bottom-Options'>
            <Link to ={`/tweet/${tweet?._id}`}>
              <FontAwesomeIcon icon={faComment} />
              <p>{tweet?.comments.length}</p>
            </Link>
            <div>
              <div onClick={() => toggle("top")} className={tweet?.reposts.includes(currentUser?._id) ? "TRC" : null}>
                <FontAwesomeIcon icon={faRetweet} />
                <p>{tweet?.quotes.length + tweet?.reposts.length}</p>
              </div>
              <div className={retweetToggle.togglefortop ? "TCBOT-Absolute" : "TCBOT-Absolute TCBOT-Absolute-Toggle"}>
                <FontAwesomeIcon icon={faX} onClick={() => toggle("top")} />
                <div onClick={() => repostQuoteCommentLike(tweet?._id, "reposttweet")}  >
                  <FontAwesomeIcon icon={faRetweet} />
                  <p>Repost</p>
                </div>
                <div onClick={() => repostQuoteCommentLike(tweet?._id, "posttweet")} >
                  <FontAwesomeIcon icon={faPen} />
                  <p>Quote</p>
                </div>
              </div>
            </div>
            <div onClick={() => repostQuoteCommentLike(tweet?._id, "liketweet")} className={tweet?.likes.includes(currentUser?._id) ? "TRL" : null} >
              <FontAwesomeIcon icon={faHeart} />
              <p>{tweet?.likes.length}</p>
            </div>
          </div>
        </div>
      </div> }
      {
       (type === "replies" || type === "singletweet") && tweet?.comments?.length > 0 && tweet.comments.map((comment, index) => (
        <div key={index} className='Tweet-Component-Container Tweet-Component-Content' >
          <div className='Tweet-Component-Imagecon'>
            <div>
              <Link to={`/profile/${comment?.user?._id}`}>
              {
                comment?.user?.profileimage === '' ? <img
                src="https://vectorified.com/images/guest-icon-3.png"
                alt="image"
                /> : <img
                src={comment?.user?.profileimage}
                alt="image"
                />
              }
              </Link>
            </div>
          </div>
          <div className='Tweet-Component-Header'>
            <div className='Tweet-Component-Header-Divider'>
              <div className='Tweet-Component-Header-Divider-Two'>
                <div>
                  <Link to={`/profile/${comment?.user?._id}`}>{comment?.user?.name}</Link>
                  <p>{formatPostTime(comment?.createdAt)}</p>
                </div>
                {
                  comment?.user?._id === currentUser?._id &&
                  <FontAwesomeIcon icon={faTrashCan} onClick={()=>handleDelete(comment?._id , "deletecomment")} />
                }
              </div>
              <p>{comment?.tweetText}</p>
            </div>
            {
             comment?.image !== "" &&
              <div className='Tweet-Component-Postimage'>
                <img src={comment?.image} alt="" />
              </div>
            }
            <div className='Tweet-Component-Bottom-Options' style={{ display: "none" }}>
              <div>
                <FontAwesomeIcon icon={faComment} />
                <p>2</p>
              </div>
              <div>
                <div onClick={() => toggle("bottom")}>
                  <FontAwesomeIcon icon={faRetweet} />
                  <p>2</p>
                </div>
                <div className={retweetToggle.toggleforbottom ? "TCBOB-Absolute" : "TCBOB-Absolute TCBOB-Absolute-Toggle"}>
                  <FontAwesomeIcon icon={faX} onClick={() => toggle("bottom")} />
                  <div>
                    <FontAwesomeIcon icon={faRetweet} />
                    <p>Repost</p>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faPen} />
                    <p>Quote</p>
                  </div>
                </div>
              </div>
              <div>
                <FontAwesomeIcon icon={faHeart} />
                <p>2</p>
              </div>
            </div>
          </div>
        </div>))
      }
    </div>)
  )
}

export default Tweet