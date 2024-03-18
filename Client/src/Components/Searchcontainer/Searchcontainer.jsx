import { React, useEffect, useState,useContext } from 'react'
import './Searchcontainer.css'
import Topnav from '../Topnav/Topnav'
import Users from '../Users/Users'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../App';
import { BASE_URL } from '../Helpers/Base_Url';
function Searchcontainer() {
    const [search, SetSearch] = useState([]);
    const { SetAppHelpers, currentUser } = useContext(appContext);
    const [searchedUsers, SetSearchedUsers] = useState([]);
    const[toggl,tfo] = useState(false);

    //handle loading
    const handleLoading = () => {
        SetAppHelpers(prevState => ({
            ...prevState,
            toggleforloading: !prevState.toggleforloading
        }));
    }
    //fetching products
    const fetchSearchedUsers = async () => {
        if(!search){
            return
        }
        try {
            handleLoading();
            const response = await axios.post(`${BASE_URL}/api/user/searchresults`,{ search: search } );
            if (response.status === 200) {
                handleLoading();
                SetSearchedUsers(response.data);
            }
        } catch (error) {
            handleLoading();
        }
    }
    //use effect to react to changes in input
    useEffect(() => {
        if (search.length === 0) {
            SetSearchedUsers([]);
            return;
        }
        fetchSearchedUsers();
     
    }, [search])

    return (
        <div className='Searchcontainer-Component'>
            <Topnav toggle={"Search"} search={search} SetSearch={SetSearch} />
            <div className='Users-Container'>
                {
                    searchedUsers.length>0 ? ( searchedUsers.map((user,index)=>
                    <Users key= {index} info={user} type = {"search"}/>) ) : (<div className='NDA'>Not found</div>)
                }
            </div>

        </div>
    )
}

export default Searchcontainer