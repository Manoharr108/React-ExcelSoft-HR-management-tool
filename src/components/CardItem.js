import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import Delete from '../assets/del white.svg'
import Edit from "../assets/edit white.svg"
import { useAuth } from "../context/Authcontext";
import { getEmployeePhotoUrl, getDefaultPhotoUrl } from "./utils/photoUtils"
const CardItem = (props) => {
  const [currEmp, setCurrEmp] = useState(props.index || 0);

  const emparr = props.employees || [];
  const empdetails = emparr[currEmp];
    const { isAdmin, canPublish, isViewer } = useAuth();


  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      switch (key) {
        case "ArrowLeft":
          setCurrEmp((prev) => Math.max(prev - 1, 0));
          break;
        case "ArrowRight":
          setCurrEmp((prev) => Math.min(prev + 1, emparr.length - 1));
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currEmp, emparr]);

  if (!empdetails) {
    return null;
  }

  const handleNext = () => {
      if (currEmp < emparr.length - 1) {
        setCurrEmp(currEmp + 1);
      }
    
  };

  const handlePrev = () => {
    if (currEmp > 0) {
      setCurrEmp(currEmp - 1);
    }
  };

const handleDelete = async () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${props.name}?`
  );

  if (!confirmed) return;

  props.setEmployees((prevEmployees) =>
    prevEmployees.filter((emp) => emp.empid !== props.value)
  );

  try {
    const response = await fetch(
      // `https://excel-soft-nodejs.vercel.app/delete/${props.value}/${props.currtab}/${props.activeQuarter}`,
      `http://localhost:9000/delete/${props.value}/${props.currtab}/${props.activeQuarter}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      props.handleAlert("Failed to delete employee!", "danger");
      throw new Error(`Failed to delete employee. Status: ${response.status}`);
    }

    props.handleAlert(`Employee ID : ${props.value} deleted successfully!`, "success");
    props.refreshCategoryCount(props.currtab);
    props.refreshPublishStatus();
  } catch (error) {
    console.error("Error deleting employee:", error);
    props.handleAlert("Failed to delete employee!", "danger");
  }
};



const handleEdit = async () => {
  props.SetLoading(true);
  try {
    const response = await fetch(
      `http://localhost:9000/employee/${props.value}/${props.currcat}/${props.activeQuarter}`
    );
    const data = await response.json();
    let name = document.getElementById("editname");
    let role = document.getElementById("editrole");
    let mail = document.getElementById("editemail");
    let id = document.getElementById("id");
    let remarks = document.getElementById("editremarks");

    id.value = data.empid;
    name.value = data.name;
    role.value = data.role; 
    remarks.value = data.remarks; 
    mail.value = data.mail; 
    
    props.SetLoading(false);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    props.SetLoading(false);
    props.handleAlert("Failed to load employee data!", "danger");
  }
};


const handleEditSubmit = async () => {
  props.SetLoading(true);
  let empid = Number.parseInt(document.getElementById("id").value);
  let name = document.getElementById("editname").value;
    let mail = document.getElementById("editemail").value;
  let role = document.getElementById("editrole").value;
  let remarks = document.getElementById("editremarks").value;

  const updatedEditForm = { name, role, remarks, mail };

  try {
    const response = await fetch(
      `http://localhost:9000/edit/${empid}/${props.currcat}/${props.activeQuarter}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEditForm),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update employee data");
    }

    const updatedEmployees = props.employees.map((emp) =>
      emp.empid === empid
        ? { ...emp, ...updatedEditForm }
        : emp
    );

    props.setEmployees(updatedEmployees);
    props.SetLoading(false);
    props.handleAlert(`Employee ID : ${empid} details updated successfully!`, "success");
  } catch (error) {
    console.error("Error updating employee data:", error);
    props.SetLoading(false);
    props.handleAlert("Failed to update employee details!", "danger");
  }
};


  return (
    <>
      {/* Card View */}
      <div
        className={`card border-1 `}
        // border-${props.epublic?"success":"danger"}
        style={{ width: "16rem", marginBottom: "1rem", cursor:"pointer" }}
      >
        
       <img
      src={getEmployeePhotoUrl(props.value)} // Use empid from props
      onError={(e) => e.target.src = getDefaultPhotoUrl()}
      className="card-img-top"
      alt="Card image"
      data-bs-toggle="modal"
      data-bs-target={`#imageModal-${props.value}`}
      />
        <div className="card-body">
          <h5 className="card-title" style={{marginBottom:"0", color:"#0f6cbd"}}>{props.name}</h5>
          <small className="card-text mb-0">
            <p style={{marginBottom:0}}>{props.role}</p>
          </small>
        </div>
        <div
          className="btncontainer container"
          style={{
            display: "flex",
            justifyContent:"center",
            alignItems:"center",
            gap: "10px",
            marginBottom:"10px"
          }}
        >
         {isAdmin&& <button
            className="btn btn-secondary"
            onClick={handleEdit}
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEditEmp"
          >
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
             <img src={Edit} alt="edit icon" style={{color:"black"}}/> <span>Edit</span> 
          </div>
          </button>}
          {isAdmin&&<button className="btn btn-danger" onClick={handleDelete}>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>

             <img src={Delete} alt="del icon" style={{color:"black"}}/> <span>Delete</span>
            </div>
          </button>}
        </div>
      </div>

      {/* Detailed Employee Modal */}
      <div
        className="modal fade modal-xl"
        id={`imageModal-${props.value}`}
        tabIndex="-1"
        aria-labelledby="employeeModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <div className="d-flex flex-column">
                {/* <h6 className="text-muted">
                  {currEmp + 1}/{emparr.length}
                </h6> */}
                <h5 className="modal-title" id="employeeModalLabel">
                  {empdetails.name} - Achiever of "{props.currtab}" in Quarter {props.activeQuarter}
                </h5>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-4 pb-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="position-relative">
                    <img 
                      src={getEmployeePhotoUrl(empdetails.empid)}
                      onError={(e) => e.target.src = getDefaultPhotoUrl()}
                      alt={empdetails.name}
                      className="img-fluid rounded shadow-sm w-100" 
                      style={{ 
                        objectFit: 'cover', 
                        height: '300px' 
                      }} 
                    />
                    <div 
                      className="position-absolute bottom-0 start-0 end-0 p-3 text-white" 
                      style={{ 
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' 
                      }}
                    >
                      <h4 className="mb-1">{empdetails.name}</h4>
                      <p className="mb-0 text-white-50">{empdetails.role}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3">
                    <h6 className="text-primary mb-3">Achievements & Remarks</h6>
                    <p className="text-muted">
                      {empdetails.remarks || "No additional remarks available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-top-0 justify-content-between bg-light rounded-bottom">
              <span className="text-muted">
                {currEmp + 1} of {emparr.length}
              </span>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={handlePrev}
                  disabled={currEmp === 0}
                >
                  <i className="fa-solid fa-chevron-left me-1"></i>
                  Previous
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={handleNext}
                  disabled={currEmp === emparr.length - 1}
                >
                  Next
                  <i className="fa-solid fa-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal - Remains the same as in the original component */}
      <div
        className="modal fade"
        id="exampleModalEditEmp"
        tabIndex="-1"
        aria-labelledby="exampleModalLabeledit"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabeledit">
                Edit Employee
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="addEmp">
                <div className="mb-3">
                  <label htmlFor="id" className="col-form-label">
                    ID:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="id"
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="col-form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="employee-role" className="col-form-label">
                    Role:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editrole"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="employee-email" className="col-form-label">
                    Email:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editemail"
                  />
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="photo" className="col-form-label">
                    Image URL:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editphoto"
                  />
                </div> */}
                <div className="mb-3">
                  <label htmlFor="remarks" className="col-form-label">
                    Remarks:
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="editremarks"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={handleEditSubmit}
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