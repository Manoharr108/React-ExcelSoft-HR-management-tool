import React from 'react';

const CardItem = (props) => {
  function handledelete(){
    let confi= window.confirm("Are you sure!! You want to delete Employee named "+props.name)
    if(confi){
      try {
        fetch(`http://localhost:9000/delete/${props.value}`,{
          method:"DELETE"
        })
        .then((res)=>{
          let updatedEmployees;
          if(res.ok){
            updatedEmployees = props.employees.filter(emp=>emp._id!==props.value)
          }
          props.setEmployees(updatedEmployees);
        })
      } catch (error) {
        console.log(error)
      }
    }
    }

    async function handleEdit(){
      let response = await fetch(`http://localhost:9000/employee/${props.value}`)
      let data = await response.json();
      let name = document.getElementById("employee-name")
      let photo = document.getElementById("photo")
      let role = document.getElementById("role")
      let id = document.getElementById("id")
      id.value = data._id
      name.value = data.name
      photo.value = data.photo
      role.value = data.role
    }

      async function handleeditsubmit(){
        let response = await fetch(`http://localhost:9000/employee/${props.value}`)
        let data = await response.json();
        let name = document.getElementById("employee-name").value
        let photo = document.getElementById("photo").value
        let role = document.getElementById("role").value
        let id = document.getElementById("id").value
        let eresponse =  await fetch(`http://localhost:9000/edit/${id}`,{
          method:"PUT",
          headers:{
            'Content-Type': 'application/json',
          }, 
          body:JSON.stringify({
            name:name,
            photo:photo,
            role:role
          })
        })
        const updatedEmployees = props.employees.map((employee) =>
          employee._id === id
            ? { ...employee, name: name, photo: photo, role: role }
            : employee
        );
        props.setEmployees(updatedEmployees);
      }

  return (
    <>
      <div className="card" style={{ width: "15rem", marginBottom: "1rem" }}>
        <img src={props.image} className="card-img-top" alt="Card image" />
        <div className="card-body">
          <h5 className="card-title">{props.name}</h5>
          <h6 className="card-title">{props.role}</h6>
          {/* <p className="card-text">{props.achievement}</p> */}
        </div>
        <div className="btncontainer container" style={{
          display:"flex",
          flexDirection:"column",
          // justifyContent:"center",
          gap:"5px",
          maxWidth:"8rem"
        }}>
          <button className='btn btn-warning' onClick={handleEdit} data-bs-toggle="modal" data-bs-target="#exampleModalEditEmp">Edit</button>
          <button className='btn btn-danger' onClick={handledelete}
          >Delete</button>
        </div>
      </div>
{/* modal view */}
{/*   that needed to be added while activating modal data-bs-toggle="modal" data-bs-target="#deleteEmp"*/}
{/* <div className="modal fade" id="deleteEmp" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Delete This Employee</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body" id='empname'>
        ....
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
      </div>
    </div>
  </div>
</div> */}
      

      {/* edit modal view */}
      <div
        className='modal fade'
        id='exampleModalEditEmp'
        tabIndex='-1'
        aria-labelledby='exampleModalLabeledit'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabeledit'>
              Edit Employee
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <form id='addEmp'>
                <div className='mb-3'>
                  <label htmlFor='employee-name' className='col-form-label'>
                    ID:
                  </label>
                  <input type='text' className='form-control' id='id' disabled/>
                </div>
                <div className='mb-3'>
                  <label htmlFor='employee-name' className='col-form-label'>
                    Name:
                  </label>
                  <input type='text' className='form-control' id='employee-name' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='role' className='col-form-label'>
                    Role:
                  </label>
                  <input type='text' className='form-control' id='role' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='photo' className='col-form-label'>
                    Image URL:
                  </label>
                  <input type='text' className='form-control' id='photo' />
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
                data-bs-dismiss='modal'
                onClick={handleeditsubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardItem;