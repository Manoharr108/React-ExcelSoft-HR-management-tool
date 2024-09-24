import React from 'react';

const CardItem = (props) => {
  

  function handledelete(){
    // document.getElementById("empname").innerHTML = `Removing this employee named "${props.name}" makes him/her removed completely from db!!`

      try {
        fetch(`http://localhost:9000/delete/${props.value}`,{
          method:"DELETE"
        })
        .then((res)=>{
          let updatedEmployees;
          if(res.ok){
            console.log(props.name)
            // console.log("confirmed delete")
            updatedEmployees = props.employees.filter(emp=>emp._id!==props.value)
          }
          props.setEmployees(updatedEmployees);
        })
      } catch (error) {
        console.log(error)
      }
      
    }
  
  function handleEdit(){
    
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
          <button className='btn btn-warning' 
          onClick={handleEdit}>Edit</button>
          <button className='btn btn-danger' onClick={handledelete} 
          >Delete</button>
        </div>
      </div>
{/* modal view */}
{/* data-bs-toggle="modal" data-bs-target="#deleteEmp"  that needed to be added while activating modal*/}
<div className="modal fade" id="deleteEmp" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5"      id="staticBackdropLabel">Delete This Employee</h1>
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
</div>
      
    </>
  );
};

export default CardItem;