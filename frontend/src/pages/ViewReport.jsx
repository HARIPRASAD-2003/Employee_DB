// ViewReport.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './ViewReport.css';
const ViewReport = () => {
  const [reports, setReports] = useState([]);
    const [role, setRole] = useState(null);
  const fetchData = async() => {
    const res = await axios.post("https://emp-db-zj0y.onrender.com/get_reports");
    // console.log(res.data);    
    setRole(await JSON.parse(localStorage.getItem("type")));

    setReports(res.data);
  }

  const del_report = async(cur_id) => {
    const res = await axios.post("https://emp-db-zj0y.onrender.com/del_reports", {id: cur_id});
    if(res.status===200){
        alert("Revoked Successsfully");
    }else{
        alert("Not yet Revoked");
    }
    fetchData();
  }
  useEffect(() => {
    // Fetch or load reports from your backend/API
    // For demonstration purposes, I'm using a static array
    // const sampleReports = [
    //   { id: 1, type: 'Public', empId: 'EMP001', issue: 'Technical glitch' },
    //   { id: 2, type: 'Anonymous', empId: 'EMP002', issue: 'Communication problem' },
    //   // Add more reports as needed
    // ];
    fetchData();
    // setReports(sampleReports);
  }, []);

  return (
    <div className="view-report-container">
      <h2 className="view-report-title">View Reports</h2>
      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <ul className="report-list">
          {reports.map((report) => (
            <li key={report.id} className="report-item">
              {/* <strong>Report Type:</strong> {report.type}
              <br /> */}
            <div>
              <strong>username:</strong>{ (report.public === "yes") ? report.username : "Anonymous"}
              <br />
              <br />
              <strong>Issue:</strong> {report.issue} </div>
              {/* <br /> */}
              <button onClick={()=>del_report(report.id)}>Revoke</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewReport;
