import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [data, setData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState('');
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [role, setRole] = useState(null);
  const [tot, setTot] = useState(0);

  const openModal = () => {
    setSelect(false);
    setUpdate(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEmployeeName("");
    setEmployeeId("");
    setDepartment("");
    setDob("");
    setGender("");
    setDesignation("");
    setSalary("");
    setEmployeeIdToUpdate('');
    setShowEdit(false);
  };

  const fetchData = async () => {
    try {
      console.log("fetchData");
      const response = await axios.get(`https://emp-db-zj0y.onrender.com/employees/${search}?page=${currentPage}&pageSize=${pageSize}`);
      let res = await axios.get(`https://emp-db-zj0y.onrender.com/tot_emp/${search}`);
      if (res.status === 200) {
        console.log(res);
        // (res.data.data);
        setTot(res.data.tot);
      }
      if (sort === "asc") {
        var sortedData = [...response.data];
        sortedData.sort((a, b) => (a.salary > b.salary) ? 1 : -1);
        setData(sortedData);
      } else if (sort === "desc") {
        var sortedData = [...response.data];
        sortedData.sort((a, b) => (a.salary > b.salary) ? -1 : 1);
        setData(sortedData);
      } else {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    try {
        const emp_ids = data.map(employee => employee.employeeId.toLowerCase());
        console.log(emp_ids);
        console.log(new Date(dob));
        if(employeeId ==="" || employeeName==="" || department==="" || designation==="" || gender==="" || salary===""){
            alert("Incomplete Details");
            return ;
        }else if(emp_ids.includes(employeeId.toLowerCase())){
            alert("employeeId  already exists!");
            return;
        }else if (isNaN(new Date(dob))) {
          alert("Invalid date of birth");
          return;      
        }else if(new Date(dob) >= Date.now()){
          alert("emp dob");
          return;
        }
      const res = await axios.post(`https://emp-db-zj0y.onrender.com/add_employee`, {
        employeeName: employeeName, employeeId:employeeId, department:department, dob:dob, gender:gender, designation:designation, salary:salary
      });
      if(res.status===200){
        console.log("added");
        fetchData();
        closeModal();
      }else{
        alert(res.data);
      }
      // alert("Employee Added  Successfully!");
    } catch (error) {
      console.log(error);
      alert("Error adding employee:", error);
    }
  };

  const handleSelect = () => {
    setSelectedData([]);
    setSelect(!select);
    setUpdate(false);
  };

  const handleDelete = async () => {
    try {
      if (selectedData.length === 0) {
        alert("No employee is selected!!");
        return;
      }
      const res = await axios.post("https://emp-db-zj0y.onrender.com/delete_employee", { ids: selectedData });
      if (res.status !== 200) {
        throw new Error("Failed to delete employees");
      }
      alert('Deleted successfully');
      fetchData();
      handleSelect();
    } catch (error) {
      alert(error.message || "An error occurred");
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
        let emp_ids = data.map((employee) => employee.employeeId);
        emp_ids = emp_ids.map((id)=> id.toLowerCase());
        console.log(emp_ids);
        if(employeeId ==="" || employeeName==="" || department==="" || designation==="" || gender==="" || salary===""){
            alert("Incomplete Details");
            return ;
        }
      const res = await axios.post(`https://emp-db-zj0y.onrender.com/update_employee/${employeeIdToUpdate}`, {
        employeeName: employeeName, employeeId:employeeId, department:department, dob:dob, gender:gender, designation:designation, salary:salary
      });
      if(res.status !== 200) {
        throw new Error("Updation Failed!");
      }
      alert("Updated Successfully");
      closeModal();
    } catch (err) {
      alert(err.message || "An error occurred");
      console.log(err);
      closeModal();
    } finally {
      fetchData();
      setUpdate(false);
      // closeModal();
    }
  }

  const handleEdit = (employee) => {
    setEmployeeName(employee.employeeName);
    setEmployeeId(employee.employeeId);
    setDepartment(employee.department);
    setDob(employee.dob);
    setGender(employee.gender);
    setDesignation(employee.designation);
    setSalary(employee.salary);
    setEmployeeIdToUpdate(employee.id);
    setShowEdit(true);
  }

  const fetchUser = async() => {
    setRole(await JSON.parse(localStorage.getItem("type")));
  }

  useEffect(() => {
    fetchData();
    fetchUser();
  }, [search, sort, pageSize, currentPage]);

  return (
    <div>
      <div className='div_table'>
        <h1>{(role?.role==="admin")?"Admin Console":"Employee Details"}</h1>
        <div className='search-box'>
          <label htmlFor='search_name'>Search</label>
          <input
            id='search_name'
            type='text'
            value={search}
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <p>Employees: {data.length}</p> */}
        </div>
        <div className='search-box'>

          <label>No. of Employees: {tot}</label><br />
          </div>
          <div className='search-box' >
          <label>No of Employees per Page: </label>
          <button className={(pageSize===5)?`static-btn`:''} onClick={()=> setPageSize(5)}>5</button>
          <button className={(pageSize===10)?`static-btn`:''} onClick={()=> setPageSize(10)}>10</button>
          <button className={(pageSize===20)?`static-btn`:''} onClick={()=> setPageSize(20)}>20</button>
          </div>
        {(role?.role==="admin")&&<div className='top-container' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <button onClick={openModal}>Add Employee</button>
          {select && <button onClick={handleDelete}>Delete Employee</button>}
          {!select ? <button onClick={handleSelect}>Select Employee</button> : <button className='cancel' onClick={handleSelect} >Cancel</button>}
          {!select && <div>
            {!update ? <button onClick={() => setUpdate(!update)}>Update</button> : <button className='cancel' onClick={() => setUpdate(!update)}>Cancel</button>}
          </div>}
          <button onClick={() => setGrid(!grid)}>{(!grid) ? "Grid" : "Box"}</button>
        </div>}
        {grid ? <table className='table'>
          <thead>
            <tr>
              {select && <th style={{ width: '10px' }}>Selected</th>}
              <th>S.No</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Designation</th>
              <th>Salary
                {/* <button className='simple-btn' onClick={() => setSort((sort === "") ? "asc" : (sort === "asc") ? "desc" : "")}>
                  {(sort === "") ? "Sort" : (sort === "asc") ? "🔽" : "🔼"}
                </button> */}
              </th>
              {update && <th>Edit</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => (
              <tr key={employee.id} onClick={() => {
                const updatedSelection = selectedData.includes(employee.id)
                  ? selectedData.filter(itemId => itemId !== employee.id)
                  : [...selectedData, employee.id];
                setSelectedData(updatedSelection);
              }}>
                {select && <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <input type='checkbox' checked={selectedData.includes(employee.id)} />
                </td>}
                <td>{index + 1}</td>
                <td>{employee.employeeId.toLowerCase()}</td>
                <td>{employee.employeeName}</td>
                <td>{employee.department}</td>
                <td>{employee.dob}</td>
                <td>{employee.gender}</td>
                <td>{employee.designation}</td>
                <td>{employee.salary}</td>
                {update && <td><button className='edit' onClick={() => handleEdit(employee)}>Edit</button></td>}
              </tr>
            ))}
          </tbody>
        </table> :
          <div className='card-container' style={{ paddingTop: '20px' }}>
            {data.map((employee, index) => (
              <div key={employee.id} className='card' onClick={() => {
                const updatedSelection = selectedData.includes(employee.id)
                  ? selectedData.filter(itemId => itemId !== employee.id)
                  : [...selectedData, employee.id];
                setSelectedData(updatedSelection);
              }}>
                {select && <div className='checkbox-container'><input type='checkbox' checked={selectedData.includes(employee._id)} /></div>}
                <div className='card-content'>
                  <div><b>S.No:</b> {index + 1}</div>
                  <div><b>Employee ID:</b> <p>{employee.employeeId.toLowerCase()}</p></div>
                  <div><b>Name:</b> <p>{employee.employeeName}</p></div>
                  <div><b>Department:</b> <p>{employee.department}</p></div>
                  <div><b>DOB:</b> <p>{employee.dob}</p></div>
                  <div><b>Gender:</b> <p>{employee.gender}</p></div>
                  <div><b>Designation:</b> <p>{employee.designation}</p></div>
                  <div><b>Salary:</b> <p>{employee.salary}</p></div>
                  {update && <div><button className='edit' onClick={() => handleEdit(employee)}>Edit</button></div>}
                </div>
              </div>
            ))}
          </div>
        }
        <div className='page-controls'>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Back
          </button>
          <div>
            <span>{`Page ${currentPage} of ${Math.ceil(tot / pageSize)}`}</span>
          </div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * pageSize >= tot}>
            Next
          </button>
        </div>
      </div>
      {showModal &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Enter Employee Details</h2>
            <label htmlFor='employeeId'>Employee ID:</label>
            <input
              type='text'
              id='employeeId'
              value={employeeId}
              placeholder='eg: emp00001'
              maxLength={8}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <label htmlFor='employeeName'>Name:</label>
            <input
              type='text'
              id='employeeName'
              value={employeeName}
              maxLength={30}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <label htmlFor='department'>Department:</label>
            <select
            id='department'
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            >
            <option value=''>Select Department</option>
            <option value='IT'>IT</option>
            <option value='HR'>HR</option>
            <option value='Finance'>Finance</option>
            <option value='Marketing'>Marketing</option>
            <option value='Sales'>Sales</option>
            <option value='Operations'>Operations</option>
            <option value='Customer Service'>Customer Service</option>
            <option value='Research and Development'>Research and Development</option>
            <option value='Quality Assurance'>Quality Assurance</option>
            <option value='Supply Chain'>Supply Chain</option>
            <option value='Legal'>Legal</option>
            <option value='Public Relations'>Public Relations</option>
            <option value='Health and Safety'>Health and Safety</option>
            <option value='Information Security'>Information Security</option>
            {/* Add more department options as needed */}
            </select>

            <label htmlFor='dob'>DOB:</label>
            <input
            type='date'
            id='dob'
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            />

            <label htmlFor='gender'>Gender:</label>
            <div className='gender-options'>
            <div className={`gender-option ${(gender === 'Male') ? 'active' : ''}`}
                onClick={()=>setGender('Male')}>
                    Male
                </div>

                <div className={`gender-option ${(gender === 'Female') ? 'active' : ''}`}
                onClick={()=>setGender('Female')}>
                    Female
                </div>

            </div>

            <label htmlFor='designation'>Designation:</label>
            <input
              type='text'
              id='designation'
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <label htmlFor='salary'>Salary:</label>
            <input
              type='number'
              id='salary'
              value={salary}
              pattern='\d{1,8}'
              max={99999999}
              onChange={(e) => setSalary(e.target.value)}
            />
            <button onClick={()=>handleAdd()}>Add</button>
            <button onClick={()=>closeModal()}>Cancel</button>
          </div>
        </div>
      }{showEdit &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Enter Employee Details</h2>
            <label htmlFor='employeeId'>Employee ID:</label>
            <input
              type='text'
              id='employeeId'
              value={employeeId}
              // onChange={(e) => setEmployeeId(e.target.value)}
            />
            <label htmlFor='employeeName'>Name:</label>
            <input
              type='text'
              id='employeeName'
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <label htmlFor='department'>Department:</label>
            <select
            id='department'
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            >
            <option value=''>Select Department</option>
            <option value='IT'>IT</option>
            <option value='HR'>HR</option>
            <option value='Finance'>Finance</option>
            <option value='Marketing'>Marketing</option>
            <option value='Sales'>Sales</option>
            <option value='Operations'>Operations</option>
            <option value='Customer Service'>Customer Service</option>
            <option value='Research and Development'>Research and Development</option>
            <option value='Quality Assurance'>Quality Assurance</option>
            <option value='Supply Chain'>Supply Chain</option>
            <option value='Legal'>Legal</option>
            <option value='Public Relations'>Public Relations</option>
            <option value='Health and Safety'>Health and Safety</option>
            <option value='Information Security'>Information Security</option>
            {/* Add more department options as needed */}
            </select>


            <label htmlFor='dob'>DOB:</label>
            <input
            type='date'
            id='dob'
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            />

            <label htmlFor='gender'>Gender:</label>
            <div className='gender-options'>
            <div className={`gender-option ${(gender === 'Male') ? 'active' : ''}`}
                onClick={()=>setGender('Male')}>
                    Male
                </div>

                <div className={`gender-option ${(gender === 'Female') ? 'active' : ''}`}
                onClick={()=>setGender('Female')}>
                    Female
                </div>

            </div>

            <label htmlFor='designation'>Designation:</label>
            <input
              type='text'
              id='designation'
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <label htmlFor='salary'>Salary:</label>
            <input
              type='text'
              id='salary'
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <button onClick={()=>handleUpdate()}>Update</button>
            <button onClick={()=>closeModal()}>Cancel</button>
          </div>
        </div>
      }
    </div>
  );
};

export default Home;
