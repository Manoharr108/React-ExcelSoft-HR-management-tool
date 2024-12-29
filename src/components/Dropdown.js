import React, { useState, useEffect } from 'react';
// import AdminButton from './AdminButton';

const Dropdown = () => {
  const [quarters, setQuarters] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState(null); 

  useEffect(() => {
    async function fetchEmployees() {
      try {
        // let response = await fetch('https://excel-soft-nodejs.vercel.app/employees'); 
        let response = await fetch('http://localhost:9000/employees'); 
        let employees = await response.json();

        // Extracting unique quarters
        let uniqueQuarters = [...new Set(employees.emp.map(emp => emp.quarter))];

        uniqueQuarters.sort((a, b) => {
          const [yearA, quarterA] = a.split('Q');
          const [yearB, quarterB] = b.split('Q');
          return yearB - yearA || quarterB - quarterA; 
        });

        setQuarters(uniqueQuarters);

        if (uniqueQuarters.length > 0) {
          setActiveQuarter(uniqueQuarters[0]); 
        }
      } catch (error) {
        console.log("Error fetching employees: ", error);
      }
    }
    fetchEmployees();
  }, []);

  const handleQuarterClick = (quarter) => {
    setActiveQuarter(quarter); 
  };

  return (
    <>
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
                  className={`dropdown-item ${quarter === activeQuarter ? 'active' : ''}`}
                  href="#"
                  onClick={() => handleQuarterClick(quarter)}
                >
                  {quarter}
                </a>
              </li>
            ))
          ) : (
            <li>
              <a className="dropdown-item" href="#">
                No quarters available
              </a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Dropdown;