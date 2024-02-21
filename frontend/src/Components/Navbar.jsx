import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    // useEffect(async()=>{
    //     if (localStorage.getItem('user')) {
    //         setUser(await JSON.parse(localStorage.getItem('user')))
    //     }else{
    //         setUser(null);
    //     }
    // },[])
    const [dark, setDark] = useState(false);
    
    
  return (
    <div className='MainNavbar'>
        <h3 className='main-title' onClick={() => {navigate('/')}}>Employee Management System</h3>
        {/* <div className='Navbar'>
            {(user===null) && <div className='nav'>
                <button onClick={() => {navigate('/login')}}>Login</button>
                <button onClick={() => {navigate('/signup')}}>Signup</button>
            </div>}
        </div> */}
        {/* <button className="dark" onClick={()=>setDark(!dark)}>{(dark)?"Dark Mode":"Light Mode"}</button> */}
    </div>
  )
}

export default Navbar