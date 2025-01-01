import React, { createContext, useState } from "react";

// Create Context
export const EmployeeContext = createContext();

// Context Provider Component
export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ text: "", type: "" });

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        loading,
        setLoading,
        alert,
        setAlert,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
