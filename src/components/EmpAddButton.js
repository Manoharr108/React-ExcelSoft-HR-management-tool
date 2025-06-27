import React, { useState } from 'react';
import Alert from './Alert';
import { useAuth } from "../context/Authcontext";
import Papa from 'papaparse';

const EmpAddButton = (props) => {
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const { isAdmin } = useAuth();

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    props.SetLoading(true);

    if (!file) {
      props.SetLoading(false);
      return setAlert({ visible: true, message: "No file selected.", type: "danger" });
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim(),
      transform: value => value.trim(),
      complete: async (results) => {
        const employees = results.data;

        const requiredFields = [
          'Employee ID',
          'Employee Name',
          'Designation',
          'Email ID',
          'Award Type',
          'Award Highlight'
        ];

        // Validate each employee record
        const validationErrors = [];
        
        for (let i = 0; i < employees.length; i++) {
          const emp = employees[i];
          const rowNumber = i + 2; // +2 because of header row and 0-based index
          
          // Check for missing required fields
          for (const field of requiredFields) {
            const value = emp[field];
            if (!value || value.toString().trim() === '') {
              validationErrors.push(`Row ${rowNumber}: Missing ${field}`);
            }
          }
          
          // Validate Employee ID specifically
          if (emp['Employee ID']) {
            const empId = emp['Employee ID'].toString().trim();
            if (empId.length !== 10) {
              validationErrors.push(`Row ${rowNumber}: Employee ID must be exactly 10 characters long (current: ${empId.length})`);
            } else if (!/^\d{10}$/.test(empId)) {
              validationErrors.push(`Row ${rowNumber}: Employee ID must contain only digits`);
            }
          }
        }

        // If there are validation errors, show them and stop processing
        if (validationErrors.length > 0) {
          props.SetLoading(false);
          const errorMessage = validationErrors.length > 3 
            ? `Found ${validationErrors.length} validation errors. First few: ${validationErrors.slice(0, 3).join('; ')}...`
            : `Validation errors: ${validationErrors.join('; ')}`;
          setAlert({ visible: true, message: errorMessage, type: "danger" });
          console.error("CSV Validation Errors:", validationErrors);
          return;
        }

        // If validation passes, process the employees
        let successCount = 0;
        let failCount = 0;
        const processingErrors = [];

        for (const empData of employees) {
          const empid = empData['Employee ID'].toString().trim();
          const name = empData['Employee Name'].toString().trim();
          const role = empData['Designation'].toString().trim();
          const mail = empData['Email ID'].toString().trim();
          const remarks = empData['Award Highlight'].toString().trim();
          const category = empData['Award Type'].toString().trim();

          try {
            const response = await fetch('http://localhost:9000/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                empid,
                name,
                role,
                mail,
                remarks,
                category,
                quarter: props.activeQuarter,
                epublic: false,
              })
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            props.setEmployees((prev) => [...prev, {
              empid,
              name,
              role,
              mail,
              remarks,
              category,
              quarter: props.activeQuarter,
              epublic: false,
            }]);

            props.refreshCategoryCount(category);
            props.refreshPublishStatus();
            successCount++;

          } catch (error) {
            failCount++;
            console.error(`Error adding employee ${empid}:`, error);
            processingErrors.push(`${empid}: ${error.message}`);
          }
        }

        props.SetLoading(false);

        // Show results
        if (failCount === 0) {
          setAlert({ visible: true, message: `${successCount} employees added successfully!`, type: "success" });
          setTimeout(() => window.location.reload(), 700);
        } else if (successCount > 0) {
          setAlert({ visible: true, message: `Partial success: ${successCount} added, ${failCount} failed. Check console for errors.`, type: "warning" });
          console.error("Processing errors:", processingErrors);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setAlert({ visible: true, message: `Upload failed. All ${failCount} entries failed.`, type: "danger" });
          console.error("All processing errors:", processingErrors);
        }
      },
      error: (err) => {
        props.SetLoading(false);
        console.error('CSV Parse Error:', err);
        setAlert({ visible: true, message: 'Error parsing CSV file! Please check the format.', type: 'danger' });
      }
    });
  };

  return (
    <>
      {alert.visible && (
        <Alert 
          text={alert.message} 
          type={alert.type} 
          onDismiss={() => setAlert({ visible: false, message: '', type: '' })} 
        />
      )}
      {isAdmin && (
        <div style={{ 
          marginTop: "4px", 
          marginLeft: "58.1rem", 
          display: "flex", 
          gap: '14px'
        }}>
          <label className="btn btn-success">
            📁 Upload .CSV
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleCSVUpload}
            />
          </label>

          {/* Delete Button */}
          {props.DeleteTabComponent}
        </div>
      )}
    </>
  );
};

export default EmpAddButton;