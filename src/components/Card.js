import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";  
import EmpAddButton from "./EmpAddButton";

function Card({ currcat, activeQuarter, SetLoading, refreshCategoryCount }) {
  const [employees, setEmployees] = useState([]); 
  const [newEmployee, setNewemployee] = useState({
    _id:"",
    name:"",
    photo:"",
    category:"",
    quater:""
  });
  const [quickadd , setquickadd] = useState("")

  function handlequickadd(e){
    setquickadd(e.target.value)
  }
  function handleclearbtn(){
    setquickadd("")
  }
  async function empaddbtn(){ //dont touch, this is the original code
    let newemp = await fetch(`http://localhost:9000/empID/${quickadd}`);
    let fdata = await newemp.json();
    if(fdata.length>0){
        const response = await fetch(`http://localhost:9000/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fdata[0].name,
            photo: fdata[0].photo,
            role: fdata[0].role,
            remarks:fdata[0].remarks,
            category: currcat,
            quater:activeQuarter
          }),
        });
        let newEmployee
        if(response.ok){
          let data = await response.json()
          newEmployee = {
            _id: data._id,
            name: data.name,
            photo: data.photo,
            role: data.role,
            remarks:data.remarks,
            category: currcat,
            quater:activeQuarter
          }
        }
          setEmployees([...employees, newEmployee]);
          refreshCategoryCount(currcat)
          handleclearbtn()
    }
    else{
      window.alert("something went wrong!! Please check with emp ID")
      handleclearbtn()
    }
  }
  async function handleMultipleEmpAdd() {
  
    const inputStr = quickadd.toString();  

    const empIds = inputStr.match(/\d{10}/g); 

    if (empIds && empIds.length > 0) {
      for (let empID of empIds) {
        try {
          let newemp = await fetch(`http://localhost:9000/empID/${empID}`);
          let fdata = await newemp.json();

          if (fdata.length > 0) {
            const response = await fetch(`http://localhost:9000/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: fdata[0].name,
                photo: fdata[0].photo,
                role: fdata[0].role,
                remarks:fdata[0].remarks,
                category: currcat,
                quater: activeQuarter
              }),
            });

            if (response.ok) {
              let data = await response.json();
              const newEmployee = {
                _id: data._id,
                name: data.name,
                photo: data.photo,
                role: data.role,
                remarks:data.remarks,
                category: currcat,
                quater: activeQuarter
              };
              setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
            }
          } else {
            console.error(`Employee ID ${empID} not found`);
          }
        } catch (error) {
          console.error(`Error adding employee ID ${empID}:`, error);
        }
      }

      refreshCategoryCount(currcat);
      handleclearbtn();
    } else {
      window.alert("Please enter valid 10-digit employee IDs.");
    }
  }
 useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true)
        const response = await fetch(`http://localhost:9000/emp/${currcat}/${activeQuarter}`);
        const data = await response.json();

        const filteredEmployees = await data.filter(emp => emp.quater === activeQuarter && emp.name && emp.name.trim() !== "" );

        setEmployees(filteredEmployees); 
        SetLoading(false)
      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    }
    {currcat && fetching();}
  }, [currcat, activeQuarter]);
  
  return (
    <>
      <div className="cardContainer" style={{
        display: "flex",
        flexWrap: "wrap",   
        gap: "10px",           
        justifyContent: "center",
        alignItems: "center",   
        margin: "0 auto",
        marginTop: "10px",  
      }}>
        {/* {console.log(employees)} */}
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <>
            {
          <CardItem 
          currtab ={currcat}
          key={employee._id} 
          index={index}
          name={employee.name} 
          achievement={employee.achievement}
          image={employee.photo } 
            role={employee.role}
            value={employee._id}
            remarks = {employee.remarks}
            employees = {employees}
            setEmployees = {setEmployees}
            SetLoading={SetLoading}
            refreshCategoryCount={refreshCategoryCount}
            activeQuarter={activeQuarter}
            />
          }
            </>
          ))
        ) : (
          <>
          <h1>No employees found for this category.</h1>
          </>
        )}
      </div>
        <div className="addcard" >
              <div class="card" style={{"width": "18rem", "margin":"auto", 
                "marginTop":"10px", "marginBottom":"25px", padding:"15px"
              }}>
              <div class="card-body">
                <h5 class="card-title">Quick Add</h5>
                <label for="exampleInputEmail1" class="form-label">Emp ID:</label>
                <input type="number" class="form-control" id="quickempid" value={quickadd} onChange={handlequickadd}/>
              </div>
              <div className="btncontainer" style={{margin:"auto",display:"flex", justifyContent:"space-around", width:"100%"}}>
                <button className="btn btn-danger" style={{maxWidth:"50%",  }} onClick={handleclearbtn}>Clear</button>
                <button className="btn btn-primary" style={{maxWidth:"50%",  }}
                onClick={handleMultipleEmpAdd}>Add</button>
              </div>
              </div>
        </div>
      <EmpAddButton currtab ={currcat} employees={employees} setEmployees={setEmployees} setNewemployee={setNewemployee}
      activeQuarter={activeQuarter} refreshCategoryCount={refreshCategoryCount}></EmpAddButton>
    </>
  );
}

export default Card;