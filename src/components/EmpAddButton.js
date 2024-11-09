import React, { useState } from 'react';
import Alert from "./Alert";
const EmpAddButton = (props) => {
  const [alert, SetAlert] = useState({visible:false, message:""})
  
  function handleAlert(message){
    SetAlert({visible:true, message})
    setTimeout(() => {
      SetAlert({ visible: false, message: '' });
    }, 3000); 
  }

  async function handlefetchbtn(){
    let empid = document.getElementById("empid").value;
    // http://localhost:9000/empID/0000000002
    let newemp = await fetch(`http://localhost:9000/empID/${empid}`);
    let data = await newemp.json();
    if(data.length>0){
      document.getElementById('new-name').value = data[0].name;
      document.getElementById('new-role').value = data[0].role;
      document.getElementById('new-photo').value = data[0].photo;
    }
    else{
      window.alert("Employee not found!!");
    }
  }
  
  async function handleAddEmpbtn() {
    let name = document.getElementById('new-name').value;
    let role = document.getElementById('new-role').value;
    let photo = document.getElementById('new-photo').value;
    let quater = props.activeQuarter

    try {
      const response = await fetch(`http://localhost:9000/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          photo: photo,
          role: role,
          category: props.currtab,
          quater:quater
        }),
      });

      if (response.ok) {
        const data = await response.json(); 
        const newEmployee = {
          _id: data._id,
          name: name,
          photo: photo,
          role: role,
          category: props.currtab,
          quater:quater
        };

        props.setEmployees([...props.employees, newEmployee]);
        props.refreshCategoryCount(props.currtab)
        document.getElementById('newform').reset();
        handleAlert("A new employee added!!")
        document.getElementById("empid").value =""
      }
    } catch (error) {
      console.log('Something went wrong!! ' + error);
    }
  }

  return (
    <>
      {alert.visible && <Alert  text={alert.message}></Alert>}
      <button
        className='btn btn-success'
        type='button'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          marginTop: '30px',
        }}
        data-bs-toggle='modal'
        data-bs-target='#exampleModalEmp'
      >
        Add Employee ➕
      </button>

      {/* modal view */}
      <div
        className='modal fade'
        id='exampleModalEmp'
        tabIndex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabel'>
                Add Employee For "{`${props.currtab}`}" - {props.activeQuarter}
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
            {/* kind of acting of form */}
                <div className='mb-3'>
                    <label htmlFor='empId' className='col-form-label'>
                      EMP ID:
                    </label>
                    <input type='number' className='form-control' id='empid'/>
                  </div>
                  <button className='btn btn-primary' id='fetchBtn' onClick={handlefetchbtn} >Fetch</button>
            {/* kind of acting of form */}
              <form id='newform'>
                <div className='mb-3' style={{display:"none"}}>
                  <label htmlFor='quater' className='col-form-label'>
                    Quarter:
                  </label>
                  <input type='text' className='form-control' value={props.activeQuarter} disabled />
                </div>
                <div className='mb-3'>
                  <label htmlFor='employee-name' className='col-form-label'>
                    Name:
                  </label>
                  <input type='text' className='form-control' id='new-name' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='role' className='col-form-label'>
                    Role:
                  </label>
                  <input type='text' className='form-control' id='new-role' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='photo' className='col-form-label'>
                    Image URL:
                  </label>
                  <input type='text' className='form-control' id='new-photo' />
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Close
              </button>
              <button
                type='submit'
                className='btn btn-success'
                onClick={handleAddEmpbtn}
                data-bs-dismiss='modal'
              >
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
