import React, { useState, useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Alert from "./Alert";

const AdminButton = () => {
  const [quarters, setQuarters] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, SetLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

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
        document.getElementById("quarter").value = activeQuarter;

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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    let proceed = true;
    categories.forEach((i) => {
      if (i === newCategory && document.getElementById("quarter").value === activeQuarter) {
        setNewCategory("");
        setAlert({ visible: true, message: "This category already exists!", type: "danger" }); // Show error alert
        proceed = false;
      }
    });

    if (newCategory && proceed) {
      try {
        const response = await fetch("http://localhost:9000/addtab", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: newCategory,
            quarter: document.getElementById("quarter").value,
          }),
        });

        if (response.ok) {
          setCategories([...categories, newCategory]);
          setActiveCategory(newCategory);
          setNewCategory("");
          
          setAlert({ visible: true, message: "Category added successfully!", type: "success" }); // Success alert
          
          if (document.getElementById("quarter").value !== activeQuarter) {
            window.location.reload();
          }
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.log("Error:", error);
        setAlert({ visible: true, message: "Error adding category.", type: "danger" }); // Show error alert
      }
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
      <div
        className="dropdown"
        style={{
          marginTop: "-24px",
          float: "right",
          marginRight: "12px",
        }}
      >
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Select Quarter
        </button>
        <ul className="dropdown-menu">
          {quarters.length > 0 ? (
            quarters.map((quarter, index) => (
              <li key={index}>
                <a
                  className={`dropdown-item ${
                    activeQuarter === quarter ? "active" : ""
                  }`}
                  onClick={() => handleSelectQuarter(quarter)} // Handle click
                  style={{ cursor: "pointer" }}
                >
                  {quarter}
                </a>
              </li>
            ))
          ) : (
            <li>
              <a className="dropdown-item">No quarters available</a>
            </li>
          )}
        </ul>
      </div>
      <button
        className="btn btn-warning"
        style={{
          marginTop: "74px",
          position: "absolute",
          left: "56.5rem",
          width: "9rem",
          height: "2.5rem",
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add Tab ➕
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add new category for - {activeQuarter}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="catadd" onSubmit={handleAddCategory}>
                <div className="mb-3">
                  <label htmlFor="category-name" className="col-form-label">
                    Quarter:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="quarter"
                    placeholder="Enter New Category Name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category-name" className="col-form-label">
                    Category:
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    id="category-name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Most valuable Player">Most valuable Player</option>
                    <option value="Extra Miler">Extra Miler</option>
                    <option value="Excelearn">Excelearn</option>
                    <option value="Pat on the back">Pat on the back</option>
                  </select>
                </div>

                <div className="modal-footer" style={{ height: "3rem" }}>
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
      </div>
      {loading && <Loader></Loader>}
      
      <Header
        categories={categories}
        setCategories={setCategories}
        activeCategory={activeCategory}
        activeQuarter={activeQuarter}
        SetLoading={SetLoading}
      />
    </>
  );
};

export default AdminButton;