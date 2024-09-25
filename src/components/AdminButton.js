//add tab btn and quater dropdown
import React, { useState, useEffect } from 'react';
import Header from './Header';
const AdminButton = () => {
  const [quarters, setQuarters] = useState([]); 
  const [activeQuarter, setActiveQuarter] = useState(null); 
  const [categories, setCategories] = useState([]); 
  const [newCategory, setNewCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState(''); 
 
  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await fetch(`http://localhost:9000/employees`);
        const data = await response.json();

        // Extract unique quarters
        let uniqueQuarters = [...new Set(data.emp.map(emp => emp.quater))];
        uniqueQuarters.sort((a, b) => {
          const [yearA, quarterA] = a.split('Q');
          const [yearB, quarterB] = b.split('Q');
          return yearB - yearA || quarterB - quarterA;
        });
        
        setQuarters(uniqueQuarters); 
        // Set default active quarter on first render
        if (uniqueQuarters.length > 0 && !activeQuarter) {
          setActiveQuarter(uniqueQuarters[0]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    fetching();
    
  }, []);
  useEffect(() => {
    const fetchCategoriesByQuarter = async () => {
      if (activeQuarter) {
        try {
          const response = await fetch(`http://localhost:9000/employees`);
          const data = await response.json();
  
          const filteredEmployees = data.emp.filter(emp => emp.quater === activeQuarter);
  
          const uniqueCategories = [...new Set(filteredEmployees.map((employee) => employee.category))];
  
          setCategories(uniqueCategories);
  
          if (uniqueCategories.length > 0) {
            setActiveCategory(uniqueCategories[0]);
          } else {
            setActiveCategory(''); 
          }
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchCategoriesByQuarter();
  }, [activeQuarter]);
  

  const handleAddCategory = async (e) => {
    e.preventDefault();
    let proceed = true;
    categories.forEach((i) => {
      if (i === newCategory) {
        setNewCategory("");
        alert("This category already exists!");
        proceed = false;
      }
    });

    if (newCategory && proceed) {
      try {
        const response = await fetch('http://localhost:9000/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: newCategory, quater: document.getElementById("quarter").value }),
        });
        if (response.ok) {
          setCategories([...categories, newCategory]);
          setActiveCategory(newCategory);
          setNewCategory("");
          window.location.reload()
        } else {
          console.log('Something went wrong');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  const handleSelectQuarter = (quarter) => {
    setActiveQuarter(quarter); 
    
  };

  return (
    <>
      <button
  className="btn btn-warning"
  style={{ marginTop: '10px' }}
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
          Add new category
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
              // value={activeQuarter}
              required
              
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category-name" className="col-form-label">
              Category:
            </label>
            <input
              type="text"
              className="form-control"
              id="category-name"
              placeholder="Enter New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </div>
      

          <div className="modal-footer" style={{ height: '3rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
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
</div>



      {/* Dropdown for quarters */}
      <div className="dropdown" style={{ marginTop: '10px', float: "right" }}>
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
                  className={`dropdown-item ${activeQuarter === quarter ? 'active' : ''}`}
                  onClick={() => handleSelectQuarter(quarter)} // Handle click
                  style={{cursor:"pointer"}}
                >
                  {quarter}
                </a>
              </li>
            ))
          ) : (
            <li><a className="dropdown-item" >No quarters available</a></li>
          )}
        </ul>
      </div>

      {/* Pass categories and activeCategory to Header */}
      <Header categories={categories} setCategories={setCategories} activeCategory={activeCategory} activeQuarter={activeQuarter}/>
    </>
  );
};

export default AdminButton;