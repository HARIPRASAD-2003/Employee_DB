// Welcome.jsx
import React, { useEffect, useState } from 'react';
import { Link,  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faEdit, faExclamationCircle, faEye, faInfoCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './Welcome.css';

const Welcome = () => {
//   const history = useHistory();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    // Fetch user information from local storage
    const fetchUser = async() =>{
        const storedUser = await JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        console.log(await JSON.parse(localStorage.getItem("type")))
        setRole(await JSON.parse(localStorage.getItem("type"))?.role);
    }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="welcome-container">
      <h2 className="welcome-title">Welcome to Employee Management System</h2>
      {(!user) && <p className="welcome-message">
        Please log in to access the system and manage employee information.
      </p>}
      {(role==="admin") &&
        <div style={{display: "flex",justifyContent: "space-evenly", gap:'20px'}}> <Link to="/admin" className="login-button">
        <FontAwesomeIcon icon={faCogs} style={{ marginRight: '5px' }} />
        Admin Console
      </Link>
      <Link to="/tasks" className="login-button">
      <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
      Assign Tasks
    </Link>
      <Link to="/view_report" className="login-button">
        <FontAwesomeIcon icon={faEye} style={{ marginRight: '5px' }} />
        View Reports
      </Link>
      </div>}
      {(role==="user") &&
      <div style={{display: "flex",justifyContent: "space-evenly", gap:'20px'}}> <Link to="/admin" className="login-button">
      <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }} />
      Employee Details
    </Link>
    <Link to="/tasks" className="login-button">
      <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
      View Tasks
    </Link>
    <Link to="/add_report" className="login-button">
      <FontAwesomeIcon icon={faExclamationCircle } style={{ marginRight: '5px' }} />
      Report an Isuue
    </Link>
    </div>
      }
      {(user===null) && <Link to="/login" className="login-button">
        <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '5px' }} />
        Log In
      </Link>}
    </div>
  );
};

export default Welcome;
