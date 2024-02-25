import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
// import '../pages/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPowerOff, faTimes, faSignInAlt, faCogs, faEye, faEdit, faInfoCircle  } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (url) =>{
    closeSidebar();
    navigate(url);
  }

  const handleLogout = () =>{
    localStorage.removeItem('user');
    localStorage.removeItem("type");
    setUser(null);
    setRole(null);
    closeSidebar();
    navigate('/login');
  }

  const fetchUser = async() => {
    console.log(JSON.parse(localStorage.getItem("user")));
    if (JSON.parse(localStorage.getItem("user")) === null) return;
    setUser(await JSON.parse(localStorage.getItem("user")));
    setRole(await JSON.parse(localStorage.getItem("type")));
  }
  useEffect(()=>{
    fetchUser();  
  },[])

  return (
    <div className='MainNavbar' style={{display:'flex', justifyContent:'space-between'}}>
      <div style={{display:'flex', gap:'10px'}}>
        <FontAwesomeIcon icon={faBars} onClick={handleSidebarToggle} className='menu-icon' />
        <h3 className='main-title' onClick={() => navigate('/')}>
          Employee Management System
        </h3>
      </div>
      <div style={{paddingRight: '20px'}}>
          {(user!==null) ? <h3>{user[0]?.username}</h3> : <h3>Welcome</h3>}
      </div>

      {isSidebarOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='close-btn'>
              <h3 onClick={() => navigate('/')}>Employee Management System</h3>
              <div className='circle' onClick={closeSidebar}>
                <FontAwesomeIcon icon={faTimes}   />
              </div>
            </div>
            {(role?.role === "user") && <div className='sidebar-items' onClick={()=>handleNavigate("/admin")}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Employee Details</p>
            </div>}
            {(role?.role === "user") && <div className='sidebar-items' onClick={()=>handleNavigate("/tasks")}>
              <FontAwesomeIcon icon={faEye} style={{ color: 'black', cursor: "pointer" }}/>
              <p>View Tasks</p>
            </div>}
            {(role?.role === "user") && <div className='sidebar-items' onClick={()=>handleNavigate("/add_report")}>
              <FontAwesomeIcon icon={faEdit} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Report an Isuue</p>
            </div>}
            {(role?.role === "admin") && <div className='sidebar-items' onClick={()=>handleNavigate("/admin")}>
              <FontAwesomeIcon icon={faCogs} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Admin Console</p>
            </div>}
            {(role?.role === "admin") && <div className='sidebar-items' onClick={()=>handleNavigate("/tasks")}>
              <FontAwesomeIcon icon={faEdit} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Assign Tasks</p>
            </div>}
            {(role?.role === "admin") && <div className='sidebar-items' onClick={()=>handleNavigate("/view_report")}>
              <FontAwesomeIcon icon={faEye} style={{ color: 'black', cursor: "pointer" }}/>
              <p>View Reports</p>
            </div>}
            {(user) ? <div className='sidebar-items' onClick={()=>handleLogout()}>
              <FontAwesomeIcon icon={faPowerOff} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Logout</p>
            </div> : 
            <div className='sidebar-items' onClick={()=>navigate("/login")}>
                <FontAwesomeIcon icon={faSignInAlt} style={{color:"#16a085", marginRight:'7px'}}/>
                <p>Login/Register</p>
          </div>
            }
            {/* <div className='sidebar-items'>
              <FontAwesomeIcon icon={faPowerOff} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Logout</p>
            </div>
            <div className='sidebar-items'>
              <FontAwesomeIcon icon={faPowerOff} style={{ color: 'black', cursor: "pointer" }}/>
              <p>Logout</p>
            </div>
            Add your sidebar content here */}
            {/* Add more menu items as needed */}
          </div>
          <div  className='sidebar-bg' onClick={closeSidebar} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
