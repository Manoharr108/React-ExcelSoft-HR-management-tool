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
 useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true)
        const response = await fetch(`http://localhost:9000/emp/${currcat}/${activeQuarter}`);
        const data = await response.json();

        const filteredEmployees = data.filter(emp => emp.quater === activeQuarter && emp.name && emp.name.trim() !== "");

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
        {console.log(employees)}
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            employee.name!=null &&
          <CardItem 
            visible={'block'}
            currtab ={currcat}
            key={index} 
            index={index}
            name={employee.name} 
            achievement={employee.achievement}
            image={employee.photo ? employee.photo:"https://i.sstatic.net/kOnzy.gif"} 
            role={employee.role}
            value={employee._id}
            remarks = {employee.remarks}
            employees = {employees}
            setEmployees = {setEmployees}
            SetLoading={SetLoading}
            refreshCategoryCount={refreshCategoryCount}
            activeQuarter={activeQuarter}
          />
          ))
        ) : (
          <>
          {<CardItem employees = {employees} 
           setEmployees = {setEmployees}
           visible={'none'}
            activeQuarter={activeQuarter}
            i={0}
            currtab ={currcat}
          ></CardItem>}
          <h1>No employees found for this category.</h1>
          </>
        )}
      </div>
      <EmpAddButton currtab ={currcat} employees={employees} setEmployees={setEmployees} setNewemployee={setNewemployee}
      activeQuarter={activeQuarter} refreshCategoryCount={refreshCategoryCount}></EmpAddButton>
    </>
  );
}

export default Card;