import React, { useState } from 'react';
import Alert from './Alert';
import { useAuth } from "../context/Authcontext";
import Papa from 'papaparse';
const EmpAddButton = (props) => {
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const { isAdmin} = useAuth();


  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
  };

   const handleCSVUpload = async(e) => {
    const file = e.target.files[0];
    props.SetLoading(true)
    if (!file){
       props.SetLoading(false)
       return handleAlert("No file selected.", "danger");
      }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const employees = results.data;
        console.log("total emps:"+ employees.length)
        for (const emp of employees) {
          const {
            empid,
            name,
            role,
            photo,
            remarks,
            category,
            // quarter, (add it afterworad)
            mail
          } = emp;
          console.log(emp)
          try {
            const response = await fetch('http://localhost:9000/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                empid: parseInt(empid),
                name,
                photo,
                role,
                mail,
                remarks,
                category,
                quarter:props.activeQuarter,
                epublic: false,
              })
            });

            if (!response.ok) {
              throw new Error('Failed to add employee.');
            }

            // Add to state (optional)
            const newEmployee = {
              empid: parseInt(empid),
              name,
              role,
              photo,
              mail,
              remarks,
              category,
              quarter:props.activeQuarter,
              epublic: false,
            };

            props.setEmployees((prev) => [...prev, newEmployee]);
            props.refreshCategoryCount(category);
            props.refreshPublishStatus();
            
          } catch (error) {
            props.SetLoading(false)
            console.error(`Error adding employee ${empid}:`, error);
            handleAlert(`Error adding employee ${empid}`, 'danger');
          }
        }

        props.SetLoading(false)
        handleAlert('CSV Upload completed successfully!', 'success');
        setTimeout(() => {
  window.location.reload();
}, 700);
      },
      error: (err) => {
        props.SetLoading(false)
        console.error('CSV Parse Error:', err);
        handleAlert('Error parsing CSV file!', 'danger');
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