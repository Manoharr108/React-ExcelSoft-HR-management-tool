import React, { useEffect, useState } from "react";
import Alert from "./Alert";

const CardItem = (props) => {
  const [currEmp, setCurrEmp] = useState(props.index || 0);
  const [alert, setAlert] = useState({ text: "", type: "" }); 

  const emparr = props.employees || [];
  const empdetails = emparr[currEmp];

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
        `https://excel-soft-nodejs.vercel.app/delete/${props.value}/${props.currtab}/${props.activeQuarter}`,
        { method: "DELETE" }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete employee. Status: ${response.status}`);
      }
      props.refreshCategoryCount(props.currtab);
      setAlert({ text: "Employee deleted successfully!", type: "success" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      setAlert({ text: "Failed to delete employee!", type: "danger" });
    }
  };

  const handleEdit = async () => {
    props.SetLoading(true);
    try {
      const response = await fetch(
        `https://excel-soft-nodejs.vercel.app/employee/${props.value}/${props.currcat}/${props.activeQuarter}`
      );
      const data = await response.json();
   
      let name = document.getElementById("name");
      let photo = document.getElementById("photo");
      let role = document.getElementById("role");
      let id = document.getElementById("id");
      let remarks = document.getElementById("remarks");

      id.value = data.empid;
      name.value = data.name;
      photo.value = data.photo;
      role.value = data.role; 
      remarks.value = data.remarks; 
      props.SetLoading(false);
     
    } catch (error) {
      console.error("Error fetching employee data:", error);
      props.SetLoading(false);
      setAlert({ text: "Failed to load employee data!", type: "danger" });
    }
  };

  const handleEditSubmit = async () => {
    props.SetLoading(true);
    let empid = document.getElementById("id").value;
    empid = Number.parseInt(empid);
    let name = document.getElementById("name").value;
    let photo = document.getElementById("photo").value;
    let role = document.getElementById("role").value;
    let remarks = document.getElementById("remarks").value;

    const updatedEditForm = {
      name,
      photo,
      role,
      remarks,
    };

    try {
      const response = await fetch(
        `https://excel-soft-nodejs.vercel.app/edit/${empid}/${props.currcat}/${props.activeQuarter}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEditForm),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update employee data");
      }

      const updatedEmployees = props.employees.map((emp) => {
        if (emp.empid === empid) {
          return {
            ...emp, 
            name: updatedEditForm.name,
            photo: updatedEditForm.photo,
            role: updatedEditForm.role,
            remarks: updatedEditForm.remarks,
          };
        }
        return emp; 
      });

      props.setEmployees(updatedEmployees);
      props.SetLoading(false);
      setAlert({ text: "Employee details updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating employee data:", error);
      props.SetLoading(false);
      setAlert({ text: "Failed to update employee details!", type: "danger" });
    }
  };

  return (
    <>
      <Alert
        text={alert.text}
        type={alert.type}
        onDismiss={() => setAlert({ text: "", type: "" })}
      />
      
      {/* Card View */}
      <div
        className="card"
        style={{ width: "15rem", marginBottom: "1rem" }}
      >
        <img
          src={props.image}
          className="card-img-top"
          alt="Card image"
          data-bs-toggle="modal"
          data-bs-target={`#imageModal-${props.value}`}
        />
        <div className="card-body">
          <h5 className="card-title">{props.name}</h5>
          <h6 className="card-title">{props.role}</h6>
        </div>
        <div
          className="btncontainer container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            maxWidth: "8rem",
          }}
        >
          <button
            className="btn btn-warning"
            onClick={handleEdit}
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEditEmp"
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* Detailed Employee Modal */}
      <div
        className="modal fade modal-xl"
        id={`imageModal-${props.value}`}
        tabIndex="-1"
        aria-labelledby="employeeModalLabel"
        aria-hidden="true"
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
                      src={empdetails.photo} 
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
                  <label htmlFor="employee-id" className="col-form-label">
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
                  <label htmlFor="employee-name" className="col-form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="employee-role" className="col-form-label">
                    Role:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="employee-photo" className="col-form-label">
                    Image URL:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="photo"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="employee-remarks" className="col-form-label">
                    Remarks:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remarks"
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