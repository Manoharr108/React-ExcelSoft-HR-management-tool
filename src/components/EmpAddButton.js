import React from 'react';

const EmpAddButton = (props) => {
  async function handleAddEmpbtn() {
    let name = document.getElementById('new-name').value;
    let role = document.getElementById('new-role').value;
    let photo = document.getElementById('new-photo').value;

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
        };

        props.setEmployees([...props.employees, newEmployee]);

        document.getElementById('newform').reset();
      }
    } catch (error) {
      console.log('Something went wrong!! ' + error);
    }
  }

  return (
    <>
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
                Add Employee For "{`${props.currtab}`}" Tab
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <form id='newform'>
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
