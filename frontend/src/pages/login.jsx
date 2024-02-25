import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState("user");
    const navigate = useNavigate();
    const baseurl = "https://emp-db-zj0y.onrender.com";
  const handleLogin = async() => {
    // You can implement the login logic here
    try{

      console.log(`Logging in with username: ${username} and password: ${password}`);
      const res = await axios.post(baseurl+'/login',{user: username, pass: password, role: type});
      if (res.status === 200) {
        console.log(res.data);
        localStorage.setItem( "user", JSON.stringify(res.data));
        localStorage.setItem("type", JSON.stringify({role: type}));
        // window.location.reload();
        alert("Successfully logged in!");
        navigate("/");
      } else {
        alert("Invalid credentials! Please try again.");
      };
    }catch(err){
      alert("Invalid username or password");
    }
  };

  return (
    <div className='container'>
      <div className='login-form'>
      <h2>Login</h2>
      <div style={{display: 'flex', gap:"20px", justifyContent: 'center'}}>

<div style={{cursor: 'pointer'}} className={`input ${(type==='admin')?"select":""}`} onClick={()=>setType("admin")} >Admin</div>
  <div style={{cursor: 'pointer'}} className={`input ${(type==='user')?"select":""}`} onClick={()=>setType("user")}>User</div>
</div>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={()=>handleLogin()}>Login</button>
      {/* <div><b>Don't have an Account?</b> <p onClick={() => navigate("/signup")}>Sign Up</p></div> */}
      </form>
    </div>
    </div>
  );
};

export default Login;
