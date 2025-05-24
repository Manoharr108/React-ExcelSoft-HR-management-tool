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

  const handleCSVUpload = async(e) => {
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
      console.log("total emps:" + employees.length);
      
      // Define required fields
      const requiredFields = ['empid', 'name', 'role', 'mail', 'category'];
      
      // Validation arrays to track issues
      const validationErrors = [];
      const processedEmployees = [];
      
      // First pass: Validate all rows
      employees.forEach((emp, index) => {
        const rowNumber = index + 2; // +2 because index starts at 0 and we skip header row
        const missingFields = [];
        const invalidFields = [];
        
        // Check for missing required fields
        requiredFields.forEach(field => {
          const value = emp[field];
          if (!value || value.toString().trim() === '') {
            missingFields.push(field);
          }
        });
        
        // Additional specific validations
        if (emp.empid && isNaN(parseInt(emp.empid))) {
          invalidFields.push('empid (must be a number)');
        }
        
        // Basic email validation
        if (emp.mail && emp.mail.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emp.mail.trim())) {
            invalidFields.push('mail (invalid email format)');
          }
        }
        
        // Collect errors for this row
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
          // If validation passes, add to processed list
          processedEmployees.push({
            ...emp,
            rowNumber
          });
        }
      });
      
      // If there are validation errors, show them and stop processing
      if (validationErrors.length > 0) {
        props.SetLoading(false);
        const errorMessage = `CSV validation failed:\n${validationErrors.join('\n')}`;
        console.error(errorMessage);
        handleAlert(`CSV validation failed. Please check the following issues:\n${validationErrors.slice(0, 5).join('\n')}${validationErrors.length > 5 ? `\n...and ${validationErrors.length - 5} more errors` : ''}`, 'danger');
        return;
      }
      
      // If validation passes, process all employees
      let successCount = 0;
      let failCount = 0;
      const processingErrors = [];
      
      for (const empData of processedEmployees) {
        const {
          empid,
          name,
          role,
          photo,
          remarks,
          category,
          mail,
          rowNumber
        } = empData;
        
        try {
          const response = await fetch('http://localhost:9000/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empid: parseInt(empid),
              name: name.trim(),
              // photo: photo ? photo.trim() : '',
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

          // Add to state (optional)
          const newEmployee = {
            empid: parseInt(empid),
            name: name.trim(),
            role: role.trim(),
            // photo: photo ? photo.trim() : '',
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
      
      // Show final result
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

     <div style={{ marginTop:"-5%",marginLeft:"56.5%",}}>
          <label className="btn btn-success">
            📁 Upload Employee CSV
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleCSVUpload}
            />
          </label>
        </div>
      }


    </>
  );
};

export default EmpAddButton;