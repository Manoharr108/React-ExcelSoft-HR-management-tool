import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";  
import EmpAddButton from "./EmpAddButton";
import Alert from './Alert';
import { useAuth } from "../context/Authcontext";


function Card({ currcat, activeQuarter, SetLoading, refreshCategoryCount, refreshPublishStatus }) {
  const [employees, setEmployees] = useState([]); 
  const [newEmployee, setNewemployee] = useState({
    empid: "",
    name: "",
    photo: "",
    category: "",
    quarter: "",
    remarks: "", 
    epublic:false
  });

  const { logout,  isAdmin, canPublish, isViewer } = useAuth();
  const [quickadd, setquickadd] = useState("");
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
  function handlequickadd(e) {
    setquickadd(e.target.value);
  }

  function handleclearbtn() {
    setquickadd("");
  }

  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: "", type: "" });
    }, 3000);
  };

  async function puclishbtn(){
    try {
      SetLoading(true);
      const data = await fetch(`http://localhost:9000/publish/${activeQuarter}`, {
        method:"PUT"
      })
      
      if(!data.ok){
        SetLoading(false);
        handleAlert(`Something went wrong`, "danger");
        return 
      }
      const res  = await data.json()
      SetLoading(false);
      handleAlert(`Successfully published employees for quarter ${activeQuarter} please wait!`, "success");
      setTimeout(()=>{
        window.location.reload();
      },1000)

    } catch (error) {
      SetLoading(false);
      handleAlert(`Something went wrong`, "danger");
    }
  }

  async function handleMultipleEmpAdd() {
    const inputStr = quickadd.toString();
    const empIds = inputStr.match(/\d{10}/g);

    if (empIds && empIds.length > 0) {
      for (let empID of empIds) {
        try {
          SetLoading(true);
          // let newemp = await fetch(`https://excel-soft-nodejs.vercel.app/empID/${empID}`);
          let newemp = await fetch(`http://localhost:9000/empID/${empID}`);
          let fdata = await newemp.json();
          if (fdata.length > 0) {
            // const response = await fetch(`https://excel-soft-nodejs.vercel.app/add`, {
            const response = await fetch(`http://localhost:9000/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                empid: fdata[0].empid,
                name: fdata[0].name,
                photo: fdata[0].photo,
                role: fdata[0].role,
                remarks: fdata[0].remarks,
                category: currcat,
                quarter: activeQuarter,
                epublic:false
              }),
            });
            if(!response.ok){
              handleAlert("Employee already exists", "danger");
            }
            if (response.ok) {
              let data = await response.json();
              const newEmployee = {
                empid: data.newEmp.empid,
                name: data.newEmp.name,
                photo: data.newEmp.photo,
                role: data.newEmp.role,
                remarks: data.newEmp.remarks,
                category: currcat,
                quarter: activeQuarter,
                epublic:false
              };
              setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
              SetLoading(false);
              handleAlert("Employee added successfully!", "success");
            }
          } else {
            SetLoading(false);
            handleAlert(`Employee ID ${empID} not found`, "danger");
          }
        } catch (error) {
          SetLoading(false);
          handleAlert('Error adding employee.', 'danger');
        }
      }
      refreshCategoryCount(currcat);
      refreshPublishStatus()
      handleclearbtn();
      SetLoading(false)
    } else {
      SetLoading(false)
      handleAlert("Please enter valid 10-digit employee IDs.", "danger");
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { 
      handleMultipleEmpAdd();
    }
  };
  
  
  useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true);
        const response = await fetch(`http://localhost:9000/emp/${currcat}/${activeQuarter}`);
        const data = await response.json();

        let filteredEmployees = await data.filter(emp => emp.quarter === activeQuarter && emp.name && emp.name.trim() !== "");

        setEmployees(filteredEmployees); 
        SetLoading(false);
      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    };
    if (currcat) fetching();
  }, [currcat, activeQuarter]);
 
  return (
    <>
      {alert.visible && <Alert text={alert.message} type={alert.type} />} 
      
      <EmpAddButton
        currtab={currcat}
        employees={employees}
        setEmployees={setEmployees}
        setNewemployee={setNewemployee}
        activeQuarter={activeQuarter}
        refreshCategoryCount={refreshCategoryCount}
        refreshPublishStatus={refreshPublishStatus}
      />
      
      <div className="cardContainer" style={{
        display: "flex",
        flexWrap: "wrap",   
        gap: "10px",           
        justifyContent: "center",
        alignItems: "center",   
        margin: "0 auto",
        marginTop: "10px",  
      }}>

        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <CardItem
              key={`${employee.empid}-${index}`}
              epublic={employee.epublic}
              currtab={currcat}
              index={index}
              name={employee.name}
              achievement={employee.achievement}
              image={employee.photo }
              role={employee.role }
              value={employee.empid}
              remarks={employee.remarks || "No remarks available"}
              employees={employees}
              setEmployees={setEmployees}
              SetLoading={SetLoading}
              refreshCategoryCount={refreshCategoryCount}
              activeQuarter={activeQuarter}
              currcat={currcat}
              refreshPublishStatus={refreshPublishStatus}
            />
          ))
        ) : (
          <h1>No employees found for this category.</h1>
        )}
      </div>

     {isAdmin&& <div className="addcard">
        <div className="card" style={{ width: "18rem", margin: "auto", marginTop: "10px", marginBottom: "25px", padding: "15px" }}>
          <div className="card-body">
            <h5 className="card-title">Quick Add</h5>
            <label htmlFor="exampleInputEmail1" className="form-label">Emp ID:</label>
            <input type="number" className="form-control" id="quickempid" value={quickadd} onChange={handlequickadd} onKeyDown={handleKeyDown} />
          </div>
          <div className="btncontainer" style={{ margin: "auto", display: "flex", justifyContent: "space-around", width: "100%" }}>
            {/* <button className="btn btn-danger" style={{ maxWidth: "50%" }} onClick={handleclearbtn}>Clear</button> */}
            <button className="btn btn-primary" style={{  width: "60%" }} onClick={handleMultipleEmpAdd} >Add</button>
          </div>
        </div>
      </div>}
      <div className="publishbtn d-grid gap-2 col-6 mx-auto my-5">
     { canPublish &&<button type="button" className="btn btn-info btn-lg" onClick={puclishbtn}>PUBLISH</button>}
      </div>
      <div className="publishbtn d-grid gap-2 col-6 mx-auto my-5">
      <button type="button" className="btn btn-danger btn-lg" onClick={logout}>LOGOUT</button>
      </div>
    </>
  );
}

export default Card;