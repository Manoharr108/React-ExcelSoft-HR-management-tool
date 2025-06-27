import React, { useState, useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Alert from "./Alert";
import { useAuth } from "../context/Authcontext";

const AdminButton = () => {
  const [quarters, setQuarters] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newQuarter, setNewQuarter] = useState(""); // ← NEW STATE
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, SetLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
  const { isAdmin, canPublish, isViewer } = useAuth();

  const defaultCategories = [
    "Most valuable Player",
    "Extra Miler",
    "Excelearn",
    "Pat on the back",
  ];

  useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true);
        const response = await fetch(`http://localhost:9000/achievers-employees`);
        const data = await response.json();

        let uniqueQuarters = [...new Set(data.emp.map((emp) => emp.quarter))];
        uniqueQuarters.sort((a, b) => {
          const [yearA, quarterA] = a.split("Q");
          const [yearB, quarterB] = b.split("Q");
          return yearB - yearA || quarterB - quarterA;
        });

        setQuarters(uniqueQuarters);

        const filteredEmployees = data.emp.filter((emp) => emp.quarter === activeQuarter);
        const uniqueCategories = [...new Set(filteredEmployees.map((employee) => employee.category))];
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        } else {
          setActiveCategory("");
        }

        if (uniqueQuarters.length > 0 && !activeQuarter) {
          setActiveQuarter(uniqueQuarters[0]);
        }

        SetLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetching();
  }, [activeQuarter]);

  const handleAddNewQuarter = async (e) => {
    e.preventDefault();

    if (!newQuarter) {
      setAlert({ visible: true, message: "Quarter cannot be empty.", type: "danger" });
      return;
    }

    if (quarters.includes(newQuarter)) {
      setAlert({ visible: true, message: "Quarter already exists.", type: "danger" });
      return;
    }

    try {
      SetLoading(true);

      // Add all default categories for the new quarter
      
      // await Promise.all(
      //   defaultCategories.map((cat) =>
      //     fetch("http://localhost:9000/addtab", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         category: cat,
      //         quarter: newQuarter,
      //         epublic: false,
      //       }),
      //     })
      //   )
      // );

      // Update states
      setQuarters([newQuarter, ...quarters]);
      setActiveQuarter(newQuarter);
      setCategories(defaultCategories);
      setActiveCategory(defaultCategories[0]);
      setNewQuarter("");

      setAlert({ visible: true, message: "New quarter and default categories added!", type: "success" });
    } catch (error) {
      console.error("Error adding new quarter:", error);
      setAlert({ visible: true, message: "Failed to add new quarter.", type: "danger" });
    } finally {
      SetLoading(false);
    }
  };

  const handleSelectQuarter = (quarter) => {
    setActiveQuarter(quarter);
  };

  return (
    <>
      {alert.visible && (
        <Alert
          text={alert.message}
          type={alert.type}
          onDismiss={() => setAlert({ visible: false, message: "", type: "" })}
        />
      )}

      {/* <div className="dropdown" style={{ marginTop: "-24px", float: "right", marginRight: "12px" }}>
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          Select Quarter
        </button>
        <ul className="dropdown-menu">
          {quarters.length > 0 ? (
            quarters.map((quarter, index) => (
              <li key={index}>
                <a
                  className={`dropdown-item ${activeQuarter === quarter ? "active" : ""}`}
                  onClick={() => handleSelectQuarter(quarter)}
                  style={{ cursor: "pointer" }}
                >
                  {quarter}
                </a>
              </li>
            ) )
          ) : (
            <li>
              <a className="dropdown-item">No quarters available</a>
            </li>
          )}
        </ul>
      </div> */}

      {/* {isAdmin && (
        <button
          className="btn btn-warning"
          style={{ marginTop: "140px", position: "absolute", left: "64.4rem", height: "2.5rem" }}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add New Quarter ➕
        </button>
      )} */}

      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAddNewQuarter}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add New Quarter
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
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
                    placeholder="e.g., 2025Q1"
                    value={newQuarter}
                    onChange={(e) => setNewQuarter(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ height: "4rem" }}>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {loading && <Loader />}

      <Header
        categories={categories}
        setCategories={setCategories}
        activeCategory={activeCategory}
        activeQuarter={activeQuarter}
        SetLoading={SetLoading}
        quarters={quarters}
        handleSelectQuarter={handleSelectQuarter}
        handleAddNewQuarter={handleAddNewQuarter}
        newQuarter={newQuarter}
        setNewQuarter={setNewQuarter}
      />
    </>
  );
};

export default AdminButton;
