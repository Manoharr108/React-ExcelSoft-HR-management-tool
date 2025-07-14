import { useState, useEffect } from "react";
import CardItem from "./CardItem";
import EmpAddButton from "./EmpAddButton";
import Alert from "./Alert";
import Remarks from "./Remarks";

function Card({
  currcat,
  activeQuarter,
  SetLoading,
  refreshCategoryCount,
  refreshPublishStatus,
  DeleteTabComponent,
}) {
  const [employees, setEmployees] = useState([]);

  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: "", type: "" });
    }, 5000);
  };

  useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true);
        const response = await fetch(
          `http://localhost:9000/emp/${currcat}/${activeQuarter}`
        );
        const data = await response.json();

        let filteredEmployees = await data.filter(
          (emp) =>
            emp.quarter === activeQuarter && emp.name && emp.name.trim() !== ""
        );

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
        activeQuarter={activeQuarter}
        refreshCategoryCount={refreshCategoryCount}
        refreshPublishStatus={refreshPublishStatus}
        SetLoading={SetLoading}
        DeleteTabComponent={DeleteTabComponent}
      />

      <div
        className="cardContainer"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          marginTop: "24px",
        }}
      >
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <CardItem
              key={`${employee.empid}-${index}`}
              epublic={employee.epublic}
              currtab={currcat}
              index={index}
              name={employee.name}
              achievement={employee.achievement}
              image={employee.photo}
              role={employee.role}
              value={employee.empid}
              remarks={employee.remarks || "No remarks available"}
              employees={employees}
              setEmployees={setEmployees}
              SetLoading={SetLoading}
              refreshCategoryCount={refreshCategoryCount}
              activeQuarter={activeQuarter}
              currcat={currcat}
              refreshPublishStatus={refreshPublishStatus}
              handleAlert={handleAlert}
            />
          ))
        ) : (
          <h1>No employees found for this category.</h1>
        )}
      </div>
      <Remarks
        quarter={activeQuarter}
        category={currcat}
        handleAlert={handleAlert}
      ></Remarks>
    </>
  );
}

export default Card;