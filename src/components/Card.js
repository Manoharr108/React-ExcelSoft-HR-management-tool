import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";  
import EmpAddButton from "./EmpAddButton";
function Card({ currcat, activeQuarter, SetLoading }) {
  const [employees, setEmployees] = useState([]); 
  const [newEmployee, setNewemployee] = useState({
    _id:"",
    name:"",
    photo:"",
    category:"",
    quater:""
  });
 useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true)
        const response = await fetch(`http://localhost:9000/emp/${currcat}`);
        const data = await response.json();

        const filteredEmployees = data.filter(emp => emp.quater === activeQuarter);

        setEmployees(filteredEmployees); 
        // console.log(filteredEmployees)
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
        {employees.length > 1 ? (
          employees.map((employee, index) => (
            employee.name!=null &&
          <CardItem 
            key={index} 
            name={employee.name} 
            achievement={employee.achievement}
            image={employee.photo ? employee.photo:"https://i.sstatic.net/kOnzy.gif"} 
            role={employee.role}
            value={employee._id}
            employees = {employees}
            setEmployees = {setEmployees}
            SetLoading={SetLoading}
          />
          ))
        ) : (
          <h1>No employees found for this category.</h1>
        )}
      </div>
      <EmpAddButton currtab ={currcat} employees={employees} setEmployees={setEmployees} setNewemployee={setNewemployee}
      activeQuarter={activeQuarter}></EmpAddButton>
    </>
  );
}

export default Card;