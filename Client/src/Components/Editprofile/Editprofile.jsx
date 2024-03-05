import './Editprofile.css'
import { useState, useRef, useContext,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { appContext } from '../../App';
import { editProfileSchema } from '../Helpers/Yup';
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helpers/Base_Url';
function Editprofile() {
  const { AppHelpers, SetAppHelpers, currentUser, setCurrentUser } = useContext(appContext);
  const [userDetails, SetUserDetails] = useState({
    name: `${currentUser?.name}`,
    bio: `${currentUser?.bio}`,
    ischecked: false,
    password: "",
    confirmpassword: ""
  });
  useEffect(()=>{
    if(currentUser) {
      SetUserDetails({
        name: `${currentUser?.name}`,
        bio: `${currentUser?.bio}`,
        ischecked: false,
        password: "",
        confirmpassword: ""
      })
    }
  },[currentUser])
  const [images, SetImages] = useState({
    image1: {
      preview: '',
      file: null
    },
    image2: {
      preview: '',
      file: null
    }
  });
  const firstImageInputRef = useRef(null);
  const secondImageInputRef = useRef(null);

  const handleImageSelect = (ref) => {
    ref.current.click();
  };
  //handleing file selection
  const handleFileSelect = (event, imageKey) => {
    const file = event.target.files[0];
    SetImages({
      ...images,
      [imageKey]: {
        ...images[imageKey],
        file: file,
        preview: URL.createObjectURL(file)
      }
    });
  };
  //handle input change
  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    SetUserDetails({
      ...userDetails,
      [name]: value
    });
  };
  //toggle for edit profile
  const handleToggleEditProfile = () => {
    SetAppHelpers(prevState => ({
      ...prevState,
      toggleforeditprofile: !prevState.toggleforeditprofile
    }));
  }
  //form submit 
  const onSubmit = async (e) => {
    e.preventDefault();
    const toggleLoading = ()=>{
      SetAppHelpers(prevState=>({
          ...prevState,
          toggleforloading: !prevState.toggleforloading
        }))
    }
    try {
      const schema = editProfileSchema(userDetails.ischecked);
      await schema.validate(userDetails, { abortEarly: false });
     try{
      toggleLoading();
      const token = sessionStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
      };
      const formData = new FormData();
      formData.append("name",userDetails.name );
      formData.append("bio",userDetails.bio );
      if(userDetails.ischecked === true){
      formData.append('password',userDetails.password)
      formData.append('confirmpassword',userDetails.confirmpassword);
      }
      if(images.image1.file){
       formData.append('coverimage',images.image1.file);
      }
      if(images.image2.file){
        formData.append('profileimage',images.image2.file);
       }
      const response = await axios.post(`${BASE_URL}/api/user/updateprofile/${currentUser?._id}`,formData , {headers})
      if(response.status === 200){
        toast.success(`${response.data.message}`);
        const user = JSON.stringify(response.data.user);
        sessionStorage.setItem("user", user);
        SetUserDetails({
          name: `${currentUser?.name}`,
          bio: `${currentUser?.bio}`,
          ischecked: true,
          password: "",
          confirmpassword: "",
      });
      SetImages({
        image1: {
          preview: '',
          file: null
        },
        image2: {
          preview: '',
          file: null
        }
      })
      SetAppHelpers(prevState => ({
        ...prevState,
        toggleforeditprofile: !prevState.toggleforeditprofile
      }));
      }
      toggleLoading();
     }catch(error){
      if (error.response && error.response.status === 400) {
        toast.warn(`${error.response.data.message}`);
    } else {
        toast.error(`${error.response.data.message}`);
    }
     }

    } catch (errors) {
      const validationErrors = {};
      errors.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      SetUserDetails(prevState => ({
        ...prevState,
        errors: validationErrors
      }));

    }
  }
  return (
    <div className={AppHelpers.toggleforeditprofile ? "Editprofile-Component Editprofile-Component-Toggle" : 'Editprofile-Component'} >
      <div className='EC-First'>
        <div>
          <FontAwesomeIcon icon={faX} style={{ color: "#e7e9ea", }} onClick={handleToggleEditProfile} />
          <p>Edit Profile</p>
        </div>
        <button onClick={onSubmit} >Save</button>
      </div>
      <div className='EC-Imagecon'>
        <FontAwesomeIcon icon={faUserPlus} onClick={() => handleImageSelect(firstImageInputRef)} />
        {
          images.image1.preview !== "" || currentUser?.coverimage !== "" ? <img src={images.image1.preview !== "" ? images.image1.preview : currentUser?.coverimage} /> : null
        }
        <input type="file" style={{ display: 'none' }} ref={firstImageInputRef} onChange={(event) => handleFileSelect(event, 'image1')} />
        <div className='EC-Imagecon-Profile'>
          <FontAwesomeIcon icon={faUserPlus} onClick={() => handleImageSelect(secondImageInputRef)} />
          {
            images.image2.preview !== "" || currentUser?.profileimage !== "" ? <img src={images.image2.preview !== "" ? images.image2.preview : currentUser?.profileimage} /> : <img
              src="https://vectorified.com/images/guest-icon-3.png"
              alt="image"
            />
          }
        </div>
        <input type="file" style={{ display: 'none' }} ref={secondImageInputRef} onChange={(event) => handleFileSelect(event, 'image2')} />
      </div>
      <div className='EC-ProfileDetails'>
        <input type="text" placeholder='Name' name='name' value={userDetails.name} onChange={handleInputChange} />
        {userDetails.errors?.name && <p className="error" style={{ color: 'var(--error)', fontSize: '0.7rem' }}>{userDetails.errors.name}</p>}
        <textarea name="bio" placeholder='Bio' value={userDetails.bio} onChange={handleInputChange}></textarea>
        {userDetails.errors?.bio && <p className="error" style={{ color: 'var(--error)', fontSize: '0.7rem' }}>{userDetails.errors.bio}</p>}
        <div>
          <p>Change Password?</p>
          <input type="checkbox" name='ischecked' checked={userDetails.ischecked} onChange={handleInputChange} />
        </div>
        {
          userDetails.ischecked &&
          <>
            <input type="password" placeholder='Password' name='password' value={userDetails.password} onChange={handleInputChange} />
            {userDetails.errors?.password && <p className="error" style={{ color: 'var(--error)', fontSize: '0.7rem' }}>{userDetails.errors.password}</p>}
            <input type="password" placeholder='Confirm Password' name='confirmpassword' value={userDetails.confirmpassword} onChange={handleInputChange} />
            {userDetails.errors?.confirmpassword && <p className="error" style={{ color: 'var(--error)', fontSize: '0.7rem' }}>{userDetails.errors.confirmpassword}</p>}
          </>
        }
      </div>
    </div>
  )
}

export default Editprofile