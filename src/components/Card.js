import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";  // Import the CardItem component

function Card({ currcat }) {
  const [employees, setEmployees] = useState([]);  // State to hold the fetched employees

 useEffect(() => {
    const fetching = async () => {
      try {
        const response = await fetch(`http://localhost:9000/emp/${currcat}`);
        const data = await response.json();
        setEmployees(data); 

      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    }
    {currcat && fetching();}
  }, [currcat]);
  
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
            image={employee.photo} 
            role={employee.role}
          />
          ))
        ) : (
          <h1>No employees found for this category.</h1>
        )}
      </div>
    </>
  );
}

export default Card;
