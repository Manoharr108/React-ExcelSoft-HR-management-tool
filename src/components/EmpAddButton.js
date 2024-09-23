import React from 'react'

const EmpAddButton = (props) => {
  function handleAddEmpbtn(){
      let name = document.getElementById("employee-name").value;
      let role = document.getElementById("role").value;
      let photo = document.getElementById("photo").value;
      // console.log(name, role, photo)
    // console.log({
    //   name:name,
    //   photo:photo,
    //   role:role,
    //   category:props.curract
    // })
    try {
      fetch(`http://localhost:9000/add`,
        {method:"POST",
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            name:name,
            photo:photo,
            role:role,
            category:props.curract
          })
        }
      )
    } catch (error) {
      console.log("something went wrong!!"+error.message)
    }
  }
  return (
   <>
    <button className='btn btn-success' type='button'
    style={{
    //  height:"2.5rem",
    //  textAlign:"center",
    // //  width:"100%",
    //  marginBottom:"30px",
    //  float:"right",

    position: "fixed",
    bottom: "20px",
    right: "20px",
    }}
    data-bs-toggle="modal"
    data-bs-target="#exampleModalEmp"
    >Add Employee ➕</button>

      {/* modal view */}
        <div className="modal fade" id="exampleModalEmp" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Employee For "{`${props.curract}`}" Tab</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form id='addEmp'>
                  <div className="mb-3">
                    <label htmlFor="employee-name" className="col-form-label">Name:</label>
                    <input type="text" className="form-control" id="employee-name"/>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role-name" className="col-form-label">Role:</label>
                    <input type="text" className="form-control" id="role"/>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="col-form-label">Image URL:</label>
                    <input type="text" className="form-control" id="photo"/>
                  </div>
                  
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-success" onClick={handleAddEmpbtn}>ADD</button>
              </div>
            </div>
          </div>
        </div>
   </>
  )
}

export default EmpAddButton
