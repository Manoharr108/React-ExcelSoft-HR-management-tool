import React, { useState } from "react";
import Alert from "./Alert";
import { useAuth } from "../context/Authcontext";
const DeleteTab = (props) => {
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
      const { isAdmin, canPublish, isViewer } = useAuth();

  const handleDeleteBtn = async () => {
    
    try {
      const response = await fetch(
        `http://localhost:9000/tab/${props.value}/${props.activeQuarter}`,
        // `https://excel-soft-nodejs.vercel.app/tab/${props.value}/${props.activeQuarter}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Filter out the deleted category
        const updatedCategories = props.categories.filter(
          (category) => category !== props.value
        );

        props.setCategories(updatedCategories);

        // Update the active tab
        if (updatedCategories.length > 0) {
          const lastButOneTab = updatedCategories[updatedCategories.length - 1];
          props.setActivetab(lastButOneTab);
        } else {
          window.location.reload();
        }

        // Show success alert
        setAlert({
          visible: true,
          message: `Tab "${props.value}" deleted successfully!`,
          type: "success",
        });
      } else {
        // Handle deletion failure
        setAlert({
          visible: true,
          message: `Failed to delete the tab "${props.value}". Please try again!`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error during deletion:", error);

      // Show error alert
      setAlert({
        visible: true,
        message: "An error occurred while deleting the tab.",
        type: "error",
      });
    }
  };

  const handleAlertDismiss = () => {
    setAlert({ visible: false, message: "", type: "" });
  };

  return (
    <>
      {alert.visible && (
        <Alert
          text={alert.message}
          type={alert.type}
          onDismiss={handleAlertDismiss}
        />
      )}
      {isAdmin&&<button
        className="btn btn-warning diff"
        type="button"
        style={{
          width: "9rem",
          height: "2.5rem",
          textAlign: "center",
        }}
        value={props.value}
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Delete Tab ❌
      </button>}

      {/* Modal View */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Delete Tab
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure? <br />
              {`All the employees in this tab called "${props.activeCategory}" will be `}
              <b>deleted!</b>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDeleteBtn}
                data-bs-dismiss="modal"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteTab;
