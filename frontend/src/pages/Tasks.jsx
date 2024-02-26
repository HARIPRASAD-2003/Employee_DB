import React, { useEffect, useState } from 'react';
import './Tasks.css'; // Import your CSS file for styling
import axios from 'axios';

const Tasks = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [data, setData] = useState([]);
  const [change, setChange] = useState(false);
  const [title, setTitle] = useState("");
  const [empId, setEmpId] = useState("");
  const [selectEmpId, setSelectEmpId] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchUser = async() => {
    console.log(JSON.parse(localStorage.getItem("user")));
    if (JSON.parse(localStorage.getItem("user")) === null) return;
    setUser(await JSON.parse(localStorage.getItem("user")));
    setRole(await JSON.parse(localStorage.getItem("type")));
  }

  const handleTaskStatusChange = async(taskId, status) => {
    // alert(taskId + " - " + stats);
    try {
      const res = await axios.post("https://emp-db-zj0y.onrender.com/update_task",{t_id: taskId, stats: status});
      if(res.status===200){
        fetchAllTasks();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const fetchAllTasks = async() => {
    const res = await axios.get('https://emp-db-zj0y.onrender.com/get_all_tasks');
    console.log(res.data);
    setAllTasks(res.data);
  };

  const fetchData = async () => {
    try {
      console.log("fetchData");
      const response = await axios.get(`https://emp-db-zj0y.onrender.com/employees/`);
      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchData();
    fetchAllTasks();
  }, []);

  const handleAssignTask = async() => {
    try {
        // alert(empId + "  " + title);
        if(empId==="" || title===""){
            alert("Invalid Data");
            return;
        }
        const res = await axios.post("https://emp-db-zj0y.onrender.com/add_task", {title: title, emp_id: empId});
        if(res.status===200){
          setEmpId('');
          setTitle('');
          fetchAllTasks();
            // alert('Task Assigned Successfully');
            // return;
        }else{
            throw new Error("Something went wrong!");
            // return; 
        }
    } catch (error) {
        console.log(error);
        alert(error);
    }
  };

  return (
    <div className='main-container'>
      {(role?.role === "user") && (
        <div className="tasks-container">
          <h2>My Tasks</h2>
          {allTasks.length === 0 ? (
            <p>No tasks assigned.</p>
          ) : (
            <ul className="tasks-list">
              {allTasks
                .filter((task) => task.emp_id === user[0]?.id)
                .map((task) => (
                  <li key={task.id} className={`task-item ${task.stats.toLowerCase()}`}>
                    <div>
                      <strong>{task.title}</strong>
                    </div>
                    <div className="status-container">
                      <span>Status: {task.stats}</span>
                      <button onClick={() => handleTaskStatusChange(task.id, task.stats === 'In Progress' ? 'Completed' : 'In Progress')}>
                        Mark {task.stats === 'In Progress' ? 'Completed' : 'In Progress'}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {(role?.role === "admin") && (
        <div className="tasks-container">
          <h2>Assign Tasks</h2>
          <div className="add-task-form">
            <h3>Add Task</h3>
            <input type="text" placeholder="Task Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <br />
            <br />
            <select className='' value={empId} onChange={(e)=>setEmpId(e.target.value)} >
              <option value="">Select Employee</option>
              {data.map((emp)=>(<option key={emp.id} value={emp?.id}>{emp?.employeeId.toUpperCase()} {emp?.employeeName}</option>))}
              {/* Add more options as needed */}
            </select>
            <button onClick={()=> handleAssignTask()}>Add Task</button>
          </div>
          <br />
          <div className='task-container'>
            <h2>All Tasks</h2>
            <div className='add-task-form'>
              <select className='' value={selectEmpId} onChange={(e)=>setSelectEmpId(e.target.value)} >
                  <option value="">Select Employee</option>
                  {data.map((emp)=>(<option key={emp.id} value={emp?.id}>{emp?.employeeId.toUpperCase()} {emp?.employeeName}</option>))}
                  {/* Add more options as needed */}
              </select>
            </div>

          </div>
            {/* <div><b>EmpId:</b><p>{selectEmpId.toLowerCase()}</p>
            <b>count:</b><p>{allTasks.filter((t)=>t.emp_id.toString()===selectEmpId.toString()).length}</p></div> */}
          {(selectEmpId==="") ? <ul className="tasks-list">
            {allTasks.map((task) => (
              <li key={task.id} className={`task-item ${task.stats.toLowerCase()}`}>
                <div>
                  <strong>{task.title}</strong>
                </div>
                <div className="status-container">
                  <span>Status: {task?.stats}</span>
                  </div>
                  <div className='status-container'>
                  <span>Assigned to: {task?.e_id.toLowerCase()}</span>
                </div>
              </li>
            ))}
          </ul> : <ul className="tasks-list">
            {allTasks.filter((t)=>t.emp_id.toString()===selectEmpId.toString()).map((task) => (
              <li key={task.id} className={`task-item ${task.stats.toLowerCase()}`}>
                <div>
                  <strong>{task.title}</strong>
                </div>
                <div className="status-container">
                  <span>Status: {task?.stats}</span>
                  </div>
                  <div className='status-container'>
                  <span>Assigned to: {task?.e_id.toLowerCase()}</span>
                </div>
              </li>
            ))}
          </ul>}
        </div>

      )}
    </div>
  );
};

export default Tasks;
