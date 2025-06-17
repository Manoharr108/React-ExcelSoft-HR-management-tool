import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";
import EmpAddButton from "./EmpAddButton";
import Alert from './Alert';
import { useAuth } from "../context/Authcontext";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Card({ currcat, activeQuarter, SetLoading, refreshCategoryCount, refreshPublishStatus }) {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewemployee] = useState({
    empid: "",
    name: "",
    photo: "",
    category: "",
    quarter: "",
    remarks: "",
    epublic: false
  });

  const { logout, isAdmin, canPublish, isViewer } = useAuth();

  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [hrMessage, setHrMessage] = useState("");

  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: "", type: "" });
    }, 5000);
  };

  function puclishbtn() {
    setShowModal(true);
  }

  async function handleConfirmPublish() {
    try {
      SetLoading(true);
      const data = await fetch(`http://localhost:9000/publish/${activeQuarter}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hrMessage })
      });

      if (!data.ok) {
        SetLoading(false);
        handleAlert(`Something went wrong`, "danger");
        setShowModal(false);
        return;
      }

      const res = await data.json();
      console.log(res);
      SetLoading(false);
      handleAlert(`Successfully published employees for quarter ${activeQuarter} \n Status: ${res.message} \n Emails to send: ${res.emailsToSend} and please wait!!`, "success");
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      SetLoading(false);
      handleAlert(`Something went wrong`, "danger");
      setShowModal(false);
    }
  }

  const downloadAllEmployeesOfQuarter = async () => {
    try {
      SetLoading(true);
      const res = await fetch(`http://localhost:9000/download/${activeQuarter}`);
      if (!res.ok) {
        SetLoading(false);
        handleAlert("Failed to fetch employees for the quarter.", "danger");
        return;
      }
      const data = await res.json();

      if (!data || data.length === 0) {
        SetLoading(false);
        handleAlert("No employees found for the current quarter.", "danger");
        return;
      }

      const sheetData = data
        .filter(emp => emp.name && emp.name.trim() !== "" && emp.empid)
        .map(emp => ({
          EmpID: emp.empid,
          Name: emp.name,
          Role: emp.role,
          Category: emp.category,
          Quarter: emp.quarter,
          Remarks: emp.remarks,
          Published: emp.epublic ? "Yes" : "No"
        }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `All_Employees_Q${activeQuarter}`);
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, `All_Employees_Q${activeQuarter}.xlsx`);
      SetLoading(false);
    } catch (error) {
      SetLoading(false);
      handleAlert("Error downloading employee data.", "danger");
      console.error(error);
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
        SetLoading={SetLoading}
      />

      <div className="cardContainer" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        marginTop: "79px"
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

      <div className="publishbtn d-grid gap-2 col-6 mx-auto my-5">
        <button type="button" className="btn btn-secondary btn-lg" onClick={downloadAllEmployeesOfQuarter}>Download (Excel copy all the employees of current quarter)</button>
      </div>
      <div className="publishbtn d-grid gap-2 col-6 mx-auto my-5">
        {canPublish && <button type="button" className="btn btn-info btn-lg" onClick={puclishbtn}>PUBLISH</button>}
      </div>
      <div className="publishbtn d-grid gap-2 col-6 mx-auto my-5">
        <button type="button" className="btn btn-danger btn-lg" onClick={logout}>LOGOUT</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Optional HR Message</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Type your congratulatory message here (optional)..."
                  value={hrMessage}
                  onChange={(e) => setHrMessage(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmPublish}>Confirm & Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Card;
