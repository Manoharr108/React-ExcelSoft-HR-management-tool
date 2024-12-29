import React, { useState } from 'react';
import Alert from './Alert';

const EmpAddButton = (props) => {
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  
  const [employeeDetails, setEmployeeDetails] = useState({
    empid: '',
    name: '',
    role: '',
    photo: '',
    remarks: '',
  });

  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEmployeeDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleFetchBtn = async () => {
    try {
      if (!employeeDetails.empid) {
        return handleAlert('Employee ID cannot be empty!', "danger");
      }

      // const response = await fetch(`https://excel-soft-nodejs.vercel.app/empID/${employeeDetails.empid}`);
      const response = await fetch(`http://localhost:9000/empID/${employeeDetails.empid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee data.');
      }

      const data = await response.json();
      if (data.length === 0) {
        return handleAlert('Employee not found!', "danger");
      }

      setEmployeeDetails({
        empid: employeeDetails.empid,
        name: data[0].name,
        role: data[0].role,
        photo: data[0].photo,
        remarks: data[0].remarks,
      });
    } catch (error) {
      console.error('Error fetching employee:', error);
      handleAlert('Error fetching employee data!', "danger");
    }
  };

  const handleAddEmpBtn = async () => {
    let { empid, name, role, photo, remarks } = employeeDetails;
    empid = Number.parseInt(empid)
    const { currtab, activeQuarter } = props;

    if (!name || !role || !photo || !remarks) {
      return handleAlert('All fields are required!', "danger");
    }

    try {
      // const response = await fetch('https://excel-soft-nodejs.vercel.app/add', {
      const response = await fetch('http://localhost:9000/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empid,
          name,
          role,
          photo,
          category: currtab,
          quarter: activeQuarter,
          remarks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add employee.');
      }

      const newEmployee = { empid, name, role, photo, remarks, category: currtab, quarter: activeQuarter };
      props.setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
      props.refreshCategoryCount(currtab);

      setEmployeeDetails({ empid: '', name: '', role: '', photo: '', remarks: '' });
      handleAlert('A new employee has been added!', 'success');
    } catch (error) {
      console.error('Error adding employee:', error);
      handleAlert('Employee already exists or something went wrong!', 'danger');
      setEmployeeDetails({ empid: '', name: '', role: '', photo: '', remarks: '' });
    }
  };

  return (
    <>
      {alert.visible && <Alert text={alert.message} type={alert.type} onDismiss={() => setAlert({ visible: false, message: '', type: '' })} />}
      <button
        className="btn btn-success"
        type="button"
        style={{
          marginTop:"-9%",marginLeft:"63.5%",marginTop:"-8.4%"
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModalEmp"
      >
        Add Employee ➕
      </button>

      {/* Modal View */}
      <div className="modal fade" id="exampleModalEmp" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Employee for "{props.currtab}" - {props.activeQuarter}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="empid" className="col-form-label"
               
                >EMP ID:</label>
                <div style={{display:"flex", gap:"10px"}}>
                  <input
                    type="number"
                    className="form-control"
                    id="empid"
                    value={employeeDetails.empid}
                    onChange={handleInputChange}
                    placeholder='Ex:1000000001 (10 digit) '
                    />
                    <button className="btn btn-primary" onClick={handleFetchBtn}>
                    Fetch
                     </button>
                  </div>
              </div>
                  <div className="underline" style={{
                    borderBottom:"1.8px solid black"
                  }}></div>
              
              <form id="newform">
                <div className="mb-3">
                  <label htmlFor="name" className="col-form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={employeeDetails.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="col-form-label">Role:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    value={employeeDetails.role}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="photo" className="col-form-label">Image URL:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="photo"
                    value={employeeDetails.photo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="remarks" className="col-form-label">Remarks:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="remarks"
                    value={employeeDetails.remarks}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-success" onClick={handleAddEmpBtn} data-bs-dismiss="modal">
                ADD
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmpAddButton;
