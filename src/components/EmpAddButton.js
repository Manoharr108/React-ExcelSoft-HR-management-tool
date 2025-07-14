import { useState } from "react";
import Alert from "./Alert";
import { useAuth } from "../context/Authcontext";
import Papa from "papaparse";

const EmpAddButton = (props) => {
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
  const { isAdmin } = useAuth();

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    props.SetLoading(true);

    if (!file) {
      props.SetLoading(false);
      return setAlert({
        visible: true,
        message: "No file selected.",
        type: "danger",
      });
    }

    //Sync photos
    try {
      const syncResponse = await fetch("http://localhost:9000/sync-photos", {
        method: "POST",
      });
      const syncResult = await syncResponse.json();
      console.log("Photo sync result:", syncResult);
    } catch (syncErr) {
      props.SetLoading(false);
      return setAlert({
        visible: true,
        message: "Failed to synchronize photos!",
        type: "danger",
      });
    }

    // Parse & validate CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (value) => value.trim(),
      complete: async (results) => {
        const employees = results.data;
        const requiredFields = [
          "Employee ID",
          "Employee Name",
          "Designation",
          "Email ID",
          "Award Type",
          "Award Highlight",
        ];

        const validationErrors = [];

        for (let i = 0; i < employees.length; i++) {
          const emp = employees[i];
          const rowNumber = i + 2;

          // Check required fields
          for (const field of requiredFields) {
            const val = emp[field];
            if (!val || val.trim() === "") {
              validationErrors.push(`Row ${rowNumber}: Missing ${field}`);
            }
          }

          // Validate Employee ID format
          const empid = emp["Employee ID"]?.toString().trim();
          if (empid) {
            if (empid.length !== 10) {
              validationErrors.push(
                `Row ${rowNumber}: Employee ID must be exactly 10 digits`
              );
            } else if (!/^\d{10}$/.test(empid)) {
              validationErrors.push(
                `Row ${rowNumber}: Employee ID must be numeric`
              );
            }

            // Check if photo exists (HEAD request)
            try {
              const photoCheck = await fetch(
                `http://localhost:9000/photos/${empid}.png`,
                { method: "HEAD" }
              );
              if (!photoCheck.ok) {
                validationErrors.push(
                  `Row ${rowNumber}: Photo missing for Employee ID ${empid}`
                );
              }
            } catch {
              validationErrors.push(
                `Row ${rowNumber}: Could not verify photo for Employee ID ${empid}`
              );
            }
          }
        }

        if (validationErrors.length > 0) {
          props.SetLoading(false);
          const errorMessage =
            validationErrors.length > 3
              ? `Validation failed with ${
                  validationErrors.length
                } issues. First few: ${validationErrors}`
              : `Validation failed: ${validationErrors.join("; ")}`;
          console.error("CSV Validation Errors:", validationErrors);
          setAlert({ visible: true, message: errorMessage, type: "danger" });
          setTimeout(() => {
            window.location.reload()
          }, 6000);
          return;
        }

        // if validation passes then upload
        let successCount = 0;
        const processingErrors = [];

        for (const empData of employees) {
          const empid = empData["Employee ID"].trim();
          const name = empData["Employee Name"].trim();
          const role = empData["Designation"].trim();
          const mail = empData["Email ID"].trim();
          const remarks = empData["Award Highlight"].trim();
          const category = empData["Award Type"].trim();

          try {
            const response = await fetch("http://localhost:9000/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                empid,
                name,
                role,
                mail,
                remarks,
                category,
                quarter: props.activeQuarter,
                epublic: false,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            props.setEmployees((prev) => [
              ...prev,
              {
                empid,
                name,
                role,
                mail,
                remarks,
                category,
                quarter: props.activeQuarter,
                epublic: false,
              },
            ]);

            props.refreshCategoryCount(category);
            props.refreshPublishStatus();
            successCount++;
          } catch (error) {
            console.error(`Error adding employee ${empid}:`, error);
            processingErrors.push(`${empid}: ${error.message}`);
          }
        }

        props.SetLoading(false);

        if (successCount === employees.length) {
          setAlert({
            visible: true,
            message: `${successCount} employees added successfully!`,
            type: "success",
          });
          setTimeout(() => window.location.reload(), 700);
        } else if (successCount > 0) {
          setAlert({
            visible: true,
            message: `Partial success: ${successCount} added, ${
              employees.length - successCount
            } failed.`,
            type: "warning",
          });
          console.error("Processing errors:", processingErrors);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setAlert({
            visible: true,
            message: `Upload failed. No entries added.`,
            type: "danger",
          });
          console.error("All processing errors:", processingErrors);
        }
      },
      error: (err) => {
        props.SetLoading(false);
        console.error("CSV Parse Error:", err);
        setAlert({
          visible: true,
          message: "Error parsing CSV file! Please check the format.",
          type: "danger",
        });
      },
    });
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
      {isAdmin && (
        <div
          style={{
            marginTop: "-3%",
            display: "flex",
            gap: "4px",
            marginLeft:"934px"
          }}
        >
          {/* Delete Button */}
          {props.DeleteTabComponent}

          <label className="btn btn-success">
            📁 Upload .CSV
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleCSVUpload}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default EmpAddButton;