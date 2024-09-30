import React, { useEffect, useState } from 'react';

const CardItem = (props) => {
  const [currEmp, setcurrEmp] = useState(props.index)
  const emparr = props.employees;
  const empdetails = emparr[currEmp]

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      switch (key) {
        case 'ArrowLeft':
          if (currEmp > 0) {
            setcurrEmp((prev) => prev - 1);
          }
          break;
        case 'ArrowRight':
          if (currEmp < emparr.length - 1) {
            setcurrEmp((prev) => prev + 1);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currEmp, emparr.length]);


  if(!empdetails){
      return null
    }
    
  function handleNext(){
    if(currEmp<emparr.length-1){
      setcurrEmp(currEmp+1)
    }
  }
  function handlePrev(){
    if(currEmp>0){
      setcurrEmp(currEmp-1)
    }
  }

  function handledelete() {
    let confi = window.confirm("Are you sure!! You want to delete Employee named " + props.name);
    if (confi) {
      try {
        props.SetLoading(true);
        fetch(`http://localhost:9000/delete/${props.value}`, {
          method: "DELETE"
        })
          .then((res) => {
            let updatedEmployees;
            if (res.ok) {
              updatedEmployees = props.employees.filter(emp => emp._id !== props.value);
            }
            props.setEmployees(updatedEmployees);
            props.refreshCategoryCount(props.currtab);
            props.SetLoading(false);
          })
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleEdit() {
    props.SetLoading(true);
    let response = await fetch(`http://localhost:9000/employee/${props.value}`);
    let data = await response.json();
    let name = document.getElementById("employee-name");
    let photo = document.getElementById("photo");
    let role = document.getElementById("role");
    let id = document.getElementById("id");
    id.value = data._id;
    name.value = data.name;
    photo.value = data.photo;
    role.value = data.role;
    props.SetLoading(false);
  }

  async function handleeditsubmit() {
    props.SetLoading(true);
    let name = document.getElementById("employee-name").value;
    let photo = document.getElementById("photo").value;
    let role = document.getElementById("role").value;
    let id = document.getElementById("id").value;
    let eresponse = await fetch(`http://localhost:9000/edit/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        photo: photo,
        role: role
      })
    });
    const updatedEmployees = props.employees.map((employee) =>
      employee._id === id
        ? { ...employee, name: name, photo: photo, role: role }
        : employee
    );
    props.setEmployees(updatedEmployees);
    props.SetLoading(false);
  }

  return (
    <>
      <div className="card" style={{ width: "15rem", marginBottom: "1rem" }} >
        <img src={props.image} className="card-img-top" alt="Card image" data-bs-toggle="modal" data-bs-target={`#imageModal-${props.value}`} />
        <div className="card-body">
          <h5 className="card-title">{props.name}</h5>
          <h6 className="card-title">{props.role}</h6>
        </div>
        <div className="btncontainer container" style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          maxWidth: "8rem"
        }}>
          <button className='btn btn-warning' onClick={handleEdit} data-bs-toggle="modal" data-bs-target="#exampleModalEditEmp">Edit</button>
          <button className='btn btn-danger' onClick={handledelete}>Delete</button>
        </div>
      </div>

        {/* modal view */}
      <div className="modal fade modal-xl" id={`imageModal-${props.value}`} tabIndex="-1" aria-labelledby="modalwithinfo" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="header" style={{ display: "flex", flexDirection: "column" }}>
              <h6 >{currEmp+1}/{props.employees.length}</h6>
                <h1 className="modal-title fs-5" id="exampleModalLabel">{empdetails.name} - Achiever of "{props.currtab}" in Quarter {props.activeQuarter}</h1>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="modalcontaier" style={{ display: "flex", gap: "10px" }}>
                <img src={empdetails.photo} alt="image" className="img-fluid" style={{ height: "250px", width: "250px", borderRadius: "50%" }} />
                <p style={{ minWidth: "76%", background: "#e2dede", padding: "10px", fontSize: "18px" }}>{empdetails.remarks || "Manoj took charge of code reviews and ensured quality code delivery."}</p>
                <div className="arrow" style={{
                  display:"flex",
                  zIndex:1,
                  marginTop:"90px",
                  cursor:"pointer",
                  fontSize:"25px"
                }}>
                <i className="fa-solid fa-chevron-left"  onClick={handlePrev} style={{position:"absolute", left:0}}></i>
                <i className="fa-solid fa-chevron-right" onClick={handleNext} style={{position:"absolute", right:"0.5rem"}}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="modal fade modal-lg" id={`imageModal-${props.value}`} tabIndex="-1" aria-labelledby="modalwithinfo" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="header" style={{ display: "flex", flexDirection: "column" }}>
              <h6 >{props.index+1}/{props.employees.length}</h6>
                <h1 className="modal-title fs-5" id="exampleModalLabel">{props.name} - Achiever of "{props.currtab}" in Quarter {props.activeQuarter}</h1>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="modalcontaier" style={{ display: "flex", gap: "10px" }}>
                <img src={props.image} alt="image" className="img-fluid" style={{ height: "250px", width: "250px", borderRadius: "50%" }} />
                <p style={{ minWidth: "66%", background: "#e2dede", padding: "10px", fontSize: "18px" }}>{props.remarks || "Manoj took charge of code reviews and ensured quality code delivery."}</p>
                <div className="arrow" style={{
                  display:"flex",
                  zIndex:1,
                  marginTop:"90px",
                  cursor:"pointer",
                  fontSize:"25px"
                }}>
                <i className="fa-solid fa-chevron-left" style={{position:"absolute", left:0}}></i>
                <i className="fa-solid fa-chevron-right" style={{position:"absolute", right:"0.5rem"}}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className='modal fade' id='exampleModalEditEmp' tabIndex='-1' aria-labelledby='exampleModalLabeledit' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabeledit'>Edit Employee</h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <form id='addEmp'>
                <div className='mb-3'>
                  <label htmlFor='employee-name' className='col-form-label'>ID:</label>
                  <input type='text' className='form-control' id='id' disabled />
                </div>
                <div className='mb-3'>
                  <label htmlFor='employee-name' className='col-form-label'>Name:</label>
                  <input type='text' className='form-control' id='employee-name' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='role' className='col-form-label'>Role:</label>
                  <input type='text' className='form-control' id='role' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='photo' className='col-form-label'>Image URL:</label>
                  <input type='text' className='form-control' id='photo' />
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              <button type='submit' className='btn btn-success' data-bs-dismiss='modal' onClick={handleeditsubmit}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardItem;