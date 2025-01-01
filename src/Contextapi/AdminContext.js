import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
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
        const response = await fetch("http://localhost:9000/achievers-employees");
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

  return (
    <AdminContext.Provider
      value={{
        quarters,
        setQuarters,
        activeQuarter,
        setActiveQuarter,
        categories,
        setCategories,
        newCategory,
        setNewCategory,
        activeCategory,
        setActiveCategory,
        loading,
        SetLoading,
        alert,
        setAlert,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
