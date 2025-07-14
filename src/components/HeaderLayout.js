import React, { useRef, useState } from "react";
import QuickLinksMenu from "./QuickLinksMenu";
import { useAuth } from "../context/Authcontext";
import "./style/rr.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Alert from "./Alert";

function HeaderLayout({
  activeQuarter,
  handleSelectQuarter,
  categories = [],
  activeTab,
  setActiveTab,
  categoryCounts = {},
  SetLoading,
  quarters = [],
  publishstatus,
  handleAddNewQuarter,
  newQuarter,
  setNewQuarter,
}) {
  const { isAdmin, canPublish, isViewer, logout } = useAuth();
  const modalRef = useRef();
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [hrMessage, setHrMessage] = useState("");
  // Progress tracking states
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [emailProgress, setEmailProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState(null);
  
  // Function to programmatically open the modal
  const openModal = () => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: "", type: "" });
    }, 5000);
  };
  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
    }
  };
  
  function puclishbtn() {
    setShowModal(true);
  }

  // Function to fetch email progress
  const fetchEmailProgress = async () => {
    try {
      const response = await fetch(`http://localhost:9000/email/getprogress/${activeQuarter}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEmailProgress(data.progress || 0);
        
        // Stop polling when progress reaches 100
        if (data.progress == 100) {
          clearInterval(progressInterval);
          setProgressInterval(null);
          setShowProgressModal(false);
          handleAlert("All emails have been sent successfully!", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error fetching email progress:", error);
    }
  };

  // Start progress tracking
  const startProgressTracking = () => {
    setShowProgressModal(true);
    setEmailProgress(0);
    
    // Poll progress every 2 seconds
    const interval = setInterval(fetchEmailProgress, 2000);
    setProgressInterval(interval);
    
    // Initial fetch
    fetchEmailProgress();
  };

  // Stop progress tracking
  const stopProgressTracking = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    setShowProgressModal(false);
  };

  async function handleConfirmPublish() {
    try {
      SetLoading(true);
      const data = await fetch(
        `http://localhost:9000/publish/${activeQuarter}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hrMessage }),
        }
      );

      if (!data.ok) {
        SetLoading(false);
        handleAlert(`Something went wrong`, "danger");
        setShowModal(false);
        return;
      }

      const res = await data.json();
      console.log(res);
      SetLoading(false);
      setShowModal(false);
      
      // Start progress tracking after successful publish
      handleAlert(`Successfully published employees for quarter ${activeQuarter} \n Status: ${res.message} \n Emails to send: ${res.emailsToSend}`, "success");
      
      // Start tracking email progress
      startProgressTracking();
      
    } catch (error) {
      SetLoading(false);
      handleAlert(`Something went wrong`, "danger");
      setShowModal(false);
    }
  }

  // Function to get user role and welcome message
  const getUserRoleInfo = () => {
    if (isAdmin) {
      return { role: "Admin", message: "Administrator!" };
    } else if (canPublish) {
      return { role: "HR", message: "HR!" };
    } else if (isViewer) {
      return { role: "Viewer", message: "!" };
    }
    return { role: "User", message: "to Rewards and Recognition!" };
  };

  const downloadAllEmployeesOfQuarter = async () => {
    try {
      SetLoading(true);
      const res = await fetch(
        `http://localhost:9000/download/${activeQuarter}`
      );
      if (!res.ok) {
        SetLoading(false);
        return;
      }
      const data = await res.json();

      if (!data || data.length === 0) {
        SetLoading(false);
        return;
      }

      const sheetData = data
        .filter((emp) => emp.name && emp.name.trim() !== "" && emp.empid)
        .map((emp) => ({
          EmployeeID: emp.empid,
          EmployeeName: emp.name,
          EmployeeDesignation: emp.role,
          AwardType: emp.category,
          Quarter: emp.quarter,
          Remarks: emp.remarks,
          Published: emp.epublic ? "Yes" : "No",
        }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `All_Employees_Q${activeQuarter}`
      );
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, `All_Employees_Q${activeQuarter}.xlsx`);
      handleAlert(`Saved as "All_Employees_Q${activeQuarter}.xlsx"`, "success")
      SetLoading(false);
    } catch (error) {
      SetLoading(false);
      console.error(error);
    }
  };

  const { role, message } = getUserRoleInfo();

  return (
    <>
     {alert.visible && <Alert text={alert.message} type={alert.type} />}
      <section className="navigation bg-rr1 bg-rr">
        <nav className="navbar navbar-dark">
          <div className="container-fluid justify-content-between">
            <div className="d-flex flex-column flex-md-row flex-wrap">
              <a className="navbar-brand">
                <img
                  src="/ES-White-logo.png"
                  width="auto"
                  height="50px"
                  alt="Excelsoft Logo"
                />
              </a>
              <div className="text-white border-start ps-2 ms-1 d-flex flex-column">
                <span className="fs-5 fs-md-3 fs-lg-2 fs-xl-1 fw-semibold">
                  Rewards and Recognition Award Winners
                </span>
                <div
                  id="active-quarter"
                  onClick={() => console.log("Quarter Clicked")}
                >
                  {activeQuarter}{" "}
                  <span
                    style={{
                      color: publishstatus ? "#69d044" : "red",
                      fontSize: "16px",
                    }}
                  >
                    {publishstatus ? "✅Published" : "❓Not Published"}
                  </span>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-white text-end d-none d-md-block">
              <div className="d-flex align-items-end">
                <small
                  className="text-light opacity-75"
                  style={{
                    fontSize: "0.85rem",
                    textWrap: "wrap",
                    width: "174px",
                  }}
                >
                  Welcome{" "}
                  <p style={{ fontWeight: "700", marginBottom: 0 }}>
                    {message}
                  </p>
                </small>

                <div className="dropdown ">
                  <button
                    type="button"
                    className="btn dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>{" "}
                    {/* Optional icon */}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                   {canPublish&& <li>
                      <button
                        className="dropdown-item"
                        onClick={puclishbtn}
                        style={{ color: "#333" }}
                      >
                        Publish Quarter
                      </button>
                    </li>}
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={downloadAllEmployeesOfQuarter}
                        style={{ color: "#333" }}
                      >
                        Download CSV
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ color: "#333" }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Welcome Message */}
        <div className="container-fluid d-md-none">
          <div
            className="alert alert-info alert-dismissible fade show mb-3"
            role="alert"
            style={{ fontSize: "0.85rem" }}
          >
            <strong>{role}:</strong> {message}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div className="container-fluid mt-3">
          <div className="row align-items-center justify-content-between">
            {/* Tabs */}
            <div className="col-12 col-md-9 mb-3 mb-md-0">
              <ul className="nav nav-tabs flex-wrap border-0" role="tablist">
                {categories.map((category, index) => (
                  <li
                    className="nav-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(category)}
                    key={index}
                  >
                    <a
                      className={`nav-link ${
                        activeTab === category ? "active" : ""
                      }`}
                      aria-current="page"
                    >
                      {category}
                      <span
                        className={`position-absolute top-1 start-5 translate-middle badge rounded-pill bg-${
                          categoryCounts[category] > 0 ? "success" : "danger"
                        }`}
                        style={{ top: "91px", fontSize: ".8rem" }}
                      >
                        {`${categoryCounts[category] || 0}`}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dropdown + Hamburger */}
            <div className="col-12 col-md-3 d-flex justify-content-md-end align-items-center gap-2">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ minWidth: "150px", cursor: "pointer" }}
                >
                  {activeQuarter}
                </button>
                <ul className="dropdown-menu">
                  {isAdmin && (
                    <li style={{ cursor: "pointer" }}>
                      <a className="dropdown-item" onClick={openModal}>
                        ➕ Add new quarter
                      </a>
                    </li>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  {quarters.map((quarter, index) => (
                    <li key={index}>
                      <a
                        className="dropdown-item"
                        onClick={() => handleSelectQuarter(quarter)}
                        style={{ cursor: "pointer" }}
                      >
                        {quarter}
                      </a>
                    </li>
                  ))}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a
                      className="dropdown-item"
                      href="https://es-homepage.excelindia.com/es-homepage/"
                    >
                      more...
                    </a>
                  </li>
                </ul>
              </div>

              <button
                className="btn p-2 border-0"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#quickLinksMenu"
                aria-controls="quickLinksMenu"
              >
                <span className="navbar-toggler-icon custom-toggler-white"></span>
              </button>
            </div>
          </div>
        </div>
        <QuickLinksMenu SetLoading={SetLoading} />
      </section>

      {/* Modal for adding new quarter */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAddNewQuarter}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add New Quarter
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="new-quarter" className="col-form-label">
                    New Quarter:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="new-quarter"
                    placeholder={`Last Quarter is ${activeQuarter}`}
                    value={newQuarter}
                    onChange={(e) =>
                      setNewQuarter(e.target.value.toUpperCase())
                    }
                    required
                    maxLength="6"
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ height: "4rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Modal for HR Message */}
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Optional HR Message</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmPublish}
                >
                  Confirm & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Progress Modal */}
      {showProgressModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-fill me-2"></i>
                  Sending Emails...
                </h5>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="progress" style={{ height: "25px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${emailProgress}%` }}
                      aria-valuenow={emailProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {emailProgress}%
                    </div>
                  </div>
                </div>
                
                <div className="text-muted">
                  <p className="mb-1">
                    <strong>Email Progress:</strong> {emailProgress}%
                  </p>
                  <p className="mb-0">
                    <small>Please wait while we send the emails...</small>
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={stopProgressTracking}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderLayout;