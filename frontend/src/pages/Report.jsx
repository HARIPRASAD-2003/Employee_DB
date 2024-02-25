// Report.jsx
import React, { useEffect, useState } from 'react';
import './Report.css'; // Import the CSS file
import axios from 'axios';

const Report = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [empId, setEmpId] = useState('');
  const [issue, setIssue] = useState('');
  const handleSubmit = async(e) => {
    e.preventDefault();
    // alert('Submitted Report: '+  isPublic + " " + empId + " " + issue );
    const res = await axios.post("https://emp-db-zj0y.onrender.com/add_report", {emp_id: empId, issue: issue, public: (isPublic)?"yes":"no"});
    if(res.status===200){
        alert("repoted SUccessfully");
        setIsPublic(true);
        setIssue("");
    }else{
        alert("report failed");
    }
  };
  const fetchData = async() => {
    const user = await JSON.parse(localStorage.getItem("user"));
    setEmpId(user[0].id);
    console.log(user[0].id);
  }
  useEffect(()=>{
    fetchData();
  },[isPublic])
  return (
    <div className="report-container">
      <h2 className="report-title">Employee Report Form</h2>
      <form className="report-form" onSubmit={handleSubmit}>
        <label className="report-label">
          Report Type:
          <select
            className="report-select"
            value={isPublic}
            onChange={(e) => setIsPublic(e.target.value === 'true')}
          >
            <option value={true}>Public</option>
            <option value={false}>Anonymous</option>
          </select>
        </label>
        {/* <br />
        <label className="report-label">
          Employee ID:
          <input
            className="report-input"
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
        </label> */}
        <br />
        <label className="report-label">
          Issue:
          <textarea
            className="report-textarea"
            value={issue}
            maxLength={100}
            onChange={(e) => setIssue(e.target.value)}
          />
        </label>
        <br />
        <button className="report-button" type="submit">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default Report;
