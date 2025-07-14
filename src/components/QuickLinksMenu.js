import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import { useAuth } from "../context/Authcontext";

function QuickLinksMenu({ SetLoading }) {
  const [quickLinks, setQuickLinks] = useState([]);
  const [newLinks, setNewLinks] = useState({});
  const [newGroupName, setNewGroupName] = useState("");
  const { isAdmin, canPublish } = useAuth();
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const handleAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: "", type: "" });
    }, 5000);
  };

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  async function fetchQuickLinks() {
    SetLoading(true);
    try {
      let res = await fetch("http://localhost:9000/quicklinks");
      let data = await res.json();
      setQuickLinks(data);
    } catch (err) {
      console.error("Error fetching quick links", err);
      handleAlert("Error fetching quick links", "danger");
    } finally {
      SetLoading(false);
    }
  }

  async function addGroup() {
    if (!newGroupName) {
      handleAlert("Group name cannot be empty.", "danger");
      return;
    }

    SetLoading(true);
    try {
      await fetch("http://localhost:9000/addgrouplink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newGroupName, name: "", url: "" }),
      });
      setNewGroupName("");
      fetchQuickLinks();
      handleAlert("Group added successfully.", "success");
    } catch (err) {
      console.error("Error adding group", err);
      handleAlert("Error adding group", "danger");
    } finally {
      SetLoading(false);
    }
  }

  async function deleteGroup(category) {
    if (
      window.confirm(
        "Are you sure you want to delete the whole group of links! - " +
          category
      )
    ) {
      SetLoading(true);
      try {
        await fetch("http://localhost:9000/deletegroup", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
        });
        fetchQuickLinks();
        handleAlert("Group deleted successfully.", "success");
      } catch (err) {
        console.error("Error deleting group", err);
        handleAlert("Error deleting group.", "danger");
      } finally {
        SetLoading(false);
      }
    }
  }

  async function addLink(category) {
    const linkName = newLinks[`${category}-name`];
    const linkUrl = newLinks[`${category}-url`];

    if (!linkName || !linkUrl) {
      handleAlert("Link name and URL cannot be empty.", "danger");
      return;
    }

    SetLoading(true);
    try {
      await fetch("http://localhost:9000/addlink", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name: linkName, url: linkUrl }),
      });
      setNewLinks((prev) => ({
        ...prev,
        [`${category}-name`]: "",
        [`${category}-url`]: "",
      }));
      fetchQuickLinks();
      handleAlert("Link added successfully.", "success");
    } catch (err) {
      console.error("Error adding link", err);
      handleAlert("Error adding link.", "danger");
    } finally {
      SetLoading(false);
    }
  }

  async function deleteLink(category, name) {
    if (
      window.confirm(
        "Are you sure you want to delete the link called - " + name
      )
    ) {
      SetLoading(true);
      try {
        await fetch("http://localhost:9000/deletelink", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, name }),
        });
        fetchQuickLinks();
        handleAlert("Link deleted successfully.", "success");
      } catch (err) {
        console.error("Error deleting link", err);
        handleAlert("Error deleting link.", "danger");
      } finally {
        SetLoading(false);
      }
    }
  }

  async function editLink(category, name, newUrl) {
    if (!newUrl) {
      handleAlert("URL cannot be empty.", "danger");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to edit "${name}" with new url ▶️ "${newUrl}"`
      )
    ) {
      SetLoading(true);
      try {
        await fetch("http://localhost:9000/editlink", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, name, url: newUrl }),
        });
        setNewLinks("");
        fetchQuickLinks();
        handleAlert("Link edited successfully.", "success");
      } catch (err) {
        console.error("Error editing link", err);
        handleAlert("Error editing link.", "danger");
      } finally {
        SetLoading(false);
      }
    }
  }

  async function qlinkspublish() {
    if (!window.confirm("Are you sure you want to publish all Quick Links?"))
      return;

    SetLoading(true);
    try {
      const res = await fetch("http://localhost:9000/qlinks-publish", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        fetchQuickLinks();
        handleAlert("Quick links published successfully.", "success");
      } else {
        throw new Error(data.message || "Failed to publish quick links.");
      }
    } catch (err) {
      console.error("Error publishing quick links:", err);
      handleAlert("Error publishing quick links.", "danger");
    } finally {
      SetLoading(false);
    }
  }

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="quickLinksMenu"
      aria-labelledby="quickLinksMenuLabel"
      style={{ width: "44%" }}
    >
     {alert.visible && <Alert text={alert.message} type={alert.type} />}

      <div
        className="offcanvas-header"
        style={{
          backgroundColor: "#f8f9fa",
          borderBottom: "2px solid #dee2e6",
          padding: "20px",
        }}
      >
        <h5
          className="offcanvas-title"
          style={{ color: "#495057", fontWeight: "600", margin: 0 }}
        >
          Quick Links Management
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      {isAdmin && (
        <div
          className="card"
          style={{ border: "2px dashed #dee2e6", backgroundColor: "#ffffff" }}
        >
          <div className="card-body text-center" style={{ padding: "30px" }}>
            <h6 className="text-muted mb-3">Create New Group</h6>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="form-control"
                    style={{ fontSize: "0.9rem" }}
                  />
                  <button
                    className="btn btn-success"
                    onClick={addGroup}
                    style={{ fontSize: "0.9rem" }}
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="offcanvas-body"
        style={{ backgroundColor: "rgb(211 220 230)", padding: "20px" }}
      >
        {quickLinks.map((group, index) => (
          <div
            key={index}
            className="card mb-4"
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #dee2e6",
                padding: "15px 20px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h6
                  className="mb-0"
                  style={{
                    color: "#495057",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#e9ecef",
                      color: "#6c757d",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      marginRight: "10px",
                    }}
                  >
                    {index + 1}
                  </span>
                  {group.category}
                </h6>
                {isAdmin && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteGroup(group.category)}
                  >
                    Delete Group
                  </button>
                )}
              </div>
            </div>

            <div className="card-body" style={{ padding: "20px" }}>
              {group.links.map((link, idx) => (
                <div
                  key={idx}
                  className="mb-3 p-3"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div className="row align-items-start">
                    <div className="col-md-3">
                      <div className="d-flex align-items-center mb-2">
                        <span>{link.epublic ? "✔️" : "❓"}</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-hover"
                          style={{
                            color: "#495057",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          {link.name}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <textarea
                        placeholder={link.url}
                        value={
                          newLinks[`${group.category}-${link.name}-edit`] ??
                          link.url
                        }
                        onChange={(e) =>
                          setNewLinks((prev) => ({
                            ...prev,
                            [`${group.category}-${link.name}-edit`]:
                              e.target.value,
                          }))
                        }
                        disabled={!isAdmin}
                        className="form-control"
                        rows={2}
                      />
                    </div>
                    {isAdmin && (
                      <div className="col-md-3 d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            editLink(
                              group.category,
                              link.name,
                              newLinks[`${group.category}-${link.name}-edit`]
                            )
                          }
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteLink(group.category, link.name)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <div className="border-top pt-3 mt-3">
                  <h6 className="text-muted mb-3">Add New Link</h6>
                  <div className="row">
                    <div className="col-md-4">
                      <input
                        type="text"
                        value={newLinks[`${group.category}-name`] || ""}
                        onChange={(e) =>
                          setNewLinks((prev) => ({
                            ...prev,
                            [`${group.category}-name`]: e.target.value,
                          }))
                        }
                        placeholder="Link Name"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        value={newLinks[`${group.category}-url`] || ""}
                        onChange={(e) =>
                          setNewLinks((prev) => ({
                            ...prev,
                            [`${group.category}-url`]: e.target.value,
                          }))
                        }
                        placeholder="Link URL"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => addLink(group.category)}
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {canPublish && (
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={qlinkspublish}
          >
            Qlinks Publish
          </button>
        )}
      </div>

      <style jsx>{`
        .link-hover:hover {
          color: #007bff !important;
          text-decoration: underline !important;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .card {
          transition: box-shadow 0.15s ease-in-out;
        }
        .card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
        }
        .form-control:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      `}</style>
    </div>
  );
}

export default QuickLinksMenu;
