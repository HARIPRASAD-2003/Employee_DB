import React, { useState } from 'react';
import './signup.css'; // Make sure to import the correct CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState("user")
  const navigate = useNavigate();
  const baseurl = "https://emp-db-zj0y.onrender.com";
  const handleSignUp = async() => {
    console.log(`Signing up with username: ${username} and password: ${password}`);
    try {
        const res = await axios.post(baseurl+'/signup', {username: username, email: email, password: password, acc: type});
        if(res.status === 200){
            navigate('/login');
        }
    } catch (error) {
        console.log(error);
    }

  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        {/* <div style={{display: 'flex', gap:"20px", justifyContent: 'center'}}>

        <div style={{cursor: 'pointer'}} className={`input ${(type==='admin')?"select":""}`} onClick={()=>setType("admin")} >Admin</div>
          <div style={{cursor: 'pointer'}} className={`input ${(type==='user')?"select":""}`} onClick={()=>setType("user")}>User</div>
</div> */}
        <form>
          <div className="form-group">
            <label htmlFor="username" className="signup-label">
              Username:
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="signup-input"
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="signup-label">
              Email:
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup-input"
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="signup-label">
              Password:
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="signup-input"
              />
            </label>
          </div>
          <button type="button" onClick={handleSignUp} className="signup-button">
            Sign Up
          </button>
          Already have an Account?? <a href="/login">login</a>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
