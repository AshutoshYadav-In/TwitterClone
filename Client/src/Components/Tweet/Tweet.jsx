import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import './Tweet.css'
function Tweet() {
  return (
    <div className='Tweet-Component'>
      <div className='Tweet-Component-Repost'>
      <FontAwesomeIcon icon={faRetweet} />
      <p> Elon Musk reposted</p>
      </div>
      <div className='Tweet-Component-Container'>

      <div className='Tweet-Component-Imagecon'>
        <div>
          <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706339303/Nextcartassets/l2ar6zznkqmqxorjben5.jpg" alt="" />
        </div>
      </div>
      <div className='Tweet-Component-Header'>
        <div className='Tweet-Component-Header-Divider'>
          <div className='Tweet-Component-Header-Divider-Two'>
            <div>
              <Link to='/profile'>Ashutosh Yadav</Link>
              <p>12 hours ago</p>
            </div>
            <FontAwesomeIcon icon={faTrashCan} />
          </div>
          <p>Journey off the beaten path and be rewarded with incredible coastlines, delicious seafood and native wildlife on the Southern Scenic Route Who's joining you on this adventure?</p>
        </div>
        <div className='Tweet-Component-Postimage'>
          <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706632592/Userimages/h0tdfkvxon04nj7mbjfu.png" alt="" />
        </div>
        <div className='Tweet-Component-For-Replies'>
        <div className='Tweet-Component-For-Replies-Top'>
          <div>
            <img src="https://res.cloudinary.com/deeji7ttf/image/upload/v1706810102/Userimages/c0l7i9ovjbjbr2ueeunv.png" alt="" />
          </div>
          <Link to='/profile'>
            Internshala Trainings
          </Link>
          <p>18 Feb 2023</p>
        </div>
        <div className='Tweet-Component-For-Replies-Bottom'>
          <p>Journey off the beaten path and be rewarded with incredible coastlines, delicious seafood and native wildlife</p>
          <div>
            <img src="https://pbs.twimg.com/media/GGpFrm5bMAA-_7I?format=jpg&name=medium" alt="" />
          </div>
        </div>
        </div>
        <div className='Tweet-Component-Bottom-Options'>
          <div>
            <FontAwesomeIcon icon={faComment} />
            <p>2</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faRetweet} />
            <p>2</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faHeart} />
            <p>2</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Tweet