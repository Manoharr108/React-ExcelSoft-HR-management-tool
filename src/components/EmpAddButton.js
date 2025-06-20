import React, { useState } from 'react';
import Alert from './Alert';
import { useAuth } from "../context/Authcontext";
import Papa from 'papaparse';
import { getDefaultPhotoUrl } from './utils/photoUtils';
const EmpAddButton = (props) => {
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const { isAdmin} = useAuth();


  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
  };

const handleCSVUpload = async (e) => {
  const file = e.target.files[0];
  props.SetLoading(true);

  if (!file) {
    props.SetLoading(false);
    return handleAlert("No file selected.", "danger");
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const employees = results.data;

      // Updated field names
      const requiredFields = ['Employee ID', 'Employee Name', 'Designation', 'Email ID', 'Award Highlight'];

      const validationErrors = [];
      const processedEmployees = [];

      employees.forEach((emp, index) => {
        const rowNumber = index + 2;
        const missingFields = [];
        const invalidFields = [];

        requiredFields.forEach(field => {
          const value = emp[field];
          if (!value || value.toString().trim() === '') {
            missingFields.push(field);
          }
        });

        if (emp['Employee ID'] && isNaN(parseInt(emp['Employee ID']))) {
          invalidFields.push('Employee ID (must be a number)');
        }

        if (emp['Email ID'] && emp['Email ID'].trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emp['Email ID'].trim())) {
            invalidFields.push('Email ID (invalid email format)');
          }
        }

        if (missingFields.length > 0 || invalidFields.length > 0) {
          let errorMsg = `Row ${rowNumber}:`;
          if (missingFields.length > 0) {
            errorMsg += ` Missing fields: ${missingFields.join(', ')}`;
          }
          if (invalidFields.length > 0) {
            errorMsg += ` Invalid fields: ${invalidFields.join(', ')}`;
          }
          validationErrors.push(errorMsg);
        } else {
          processedEmployees.push({
            ...emp,
            rowNumber
          });
        }
      });

      if (validationErrors.length > 0) {
        props.SetLoading(false);
        const errorMessage = `CSV validation failed:\n${validationErrors.join('\n')}`;
        console.error(errorMessage);
        handleAlert(`CSV validation failed. Please check the following issues:\n${validationErrors.slice(0, 5).join('\n')}${validationErrors.length > 5 ? `\n...and ${validationErrors.length - 5} more errors` : ''}`, 'danger');
        return;
      }

      let successCount = 0;
      let failCount = 0;
      const processingErrors = [];

      for (const empData of processedEmployees) {
        const {
          rowNumber
        } = empData;

        const empid = empData['Employee ID'];
        const name = empData['Employee Name'];
        const role = empData['Designation'];
        const mail = empData['Email ID'];
        const remarks = empData['Award Highlight'];
        const category = empData['Award Type']; // Assuming 'Category' is still the same

        try {
          const response = await fetch('http://localhost:9000/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empid: parseInt(empid),
              name: name.trim(),
              role: role.trim(),
              mail: mail.trim(),
              remarks: remarks ? remarks.trim() : '',
              category: category.trim(),
              quarter: props.activeQuarter,
              epublic: false,
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          const newEmployee = {
            empid: parseInt(empid),
            name: name.trim(),
            role: role.trim(),
            mail: mail.trim(),
            remarks: remarks ? remarks.trim() : '',
            category: category.trim(),
            quarter: props.activeQuarter,
            epublic: false,
          };

          props.setEmployees((prev) => [...prev, newEmployee]);
          props.refreshCategoryCount(category.trim());
          props.refreshPublishStatus();
          successCount++;

        } catch (error) {
          failCount++;
          console.error(`Error adding employee ${empid} (Row ${rowNumber}):`, error);
          processingErrors.push(`Row ${rowNumber} (${name}): ${error.message}`);
        }
      }

      props.SetLoading(false);

      if (failCount === 0) {
        handleAlert(`CSV Upload completed successfully! ${successCount} employees added.`, 'success');
        setTimeout(() => {
          window.location.reload();
        }, 700);
      } else if (successCount > 0) {
        handleAlert(`Partial success: ${successCount} employees added, ${failCount} failed. Check console for details.`, 'warning');
        console.error('Processing errors:', processingErrors);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        handleAlert(`Upload failed: All ${failCount} employees failed to process.`, 'danger');
        console.error('All processing errors:', processingErrors);
      }
    },
    error: (err) => {
      props.SetLoading(false);
      console.error('CSV Parse Error:', err);
      handleAlert('Error parsing CSV file! Please check the file format.', 'danger');
    }
  });
};



  return (
    <>
      {alert.visible && <Alert text={alert.message} type={alert.type} onDismiss={() => setAlert({ visible: false, message: '', type: '' })} />}
      {isAdmin&&

     <div style={{ marginTop:"4px",marginLeft:"50.1rem",display:"flex", justifyContent:'center', alignItems:"center", gap:'216px'}}>
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
      }


    </>
  );
};

export default EmpAddButton;