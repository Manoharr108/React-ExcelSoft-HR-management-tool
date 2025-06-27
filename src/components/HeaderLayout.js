import React, { useRef } from 'react';
import QuickLinksMenu from './QuickLinksMenu';
import { useAuth } from "../context/Authcontext";
import './style/rr.css';
import DeleteTab from "./DeleteTab";

function HeaderLayout({
  activeQuarter,
  handleSelectQuarter,
  categories = [],
  activeTab,
  setActiveTab,
  categoryCounts = {},
  SetLoading,
  quarters = [],
  publishstatus,
  handleAddNewQuarter,
  newQuarter,
  setNewQuarter
}) {
  const { isAdmin, canPublish, isViewer } = useAuth();
  const modalRef = useRef();

  // Function to programmatically open the modal
  const openModal = () => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  // Function to get user role and welcome message
  const getUserRoleInfo = () => {
    if (isAdmin) {
      return { role: 'Admin', message: 'Welcome, Administrator! You have full system access.' };
    } else if (canPublish) {
      return { role: 'HR', message: 'Welcome, HR! You can manage and publish awards.' };
    } else if (isViewer) {
      return { role: 'Viewer', message: 'Welcome! You can view all published awards.' };
    }
    return { role: 'User', message: 'Welcome to Rewards and Recognition!' };
  };

  const { role, message } = getUserRoleInfo();

  return (
    <>
      <section className="navigation bg-rr1 bg-rr">
        <nav className="navbar navbar-dark">
          <div className="container-fluid justify-content-between">
            <div className="d-flex flex-column flex-md-row flex-wrap">
              <a className="navbar-brand">
                <img
                  src="/ES-White-logo.png"
                  width="auto"
                  height="50px"
                  alt="Excelsoft Logo"
                />
              </a>
              <div className="text-white border-start ps-2 ms-1 d-flex flex-column">
                <span className="fs-5 fs-md-3 fs-lg-2 fs-xl-1 fw-semibold">
                  Rewards and Recognition Award Winners
                </span>
                <div id="active-quarter" onClick={() => console.log('Quarter Clicked')}>
                  {activeQuarter} <span style={{ color: publishstatus ? '#69d044' : 'red', fontSize: "16px" }}>
                    {publishstatus ? '✅Published' : '❓Not Published'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="text-white text-end d-none d-md-block">
              <div className="d-flex flex-column align-items-end">
                <span className="badge bg-primary mb-1" style={{ fontSize: '1rem' }}>
                  {role}
                </span>
                <small className="text-light opacity-75" style={{ fontSize: '0.85rem',textWrap:"wrap", width:"174px" }}>
                  {message}
                </small>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Welcome Message */}
        <div className="container-fluid d-md-none">
          <div className="alert alert-info alert-dismissible fade show mb-3" role="alert" style={{ fontSize: '0.85rem' }}>
            <strong>{role}:</strong> {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>

        <div className="container-fluid mt-3">
          <div className="row align-items-center justify-content-between">
            {/* Tabs */}
            <div className="col-12 col-md-9 mb-3 mb-md-0">
              <ul className="nav nav-tabs flex-wrap border-0" role="tablist">
                {categories.map((category, index) => (
                  <li
                    className="nav-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(category)}
                    key={index}
                  >
                    <a className={`nav-link ${activeTab === category ? 'active' : ''}`} aria-current="page">
                      {category}
                      <span
                        className= {`position-absolute top-1 start-5 translate-middle badge rounded-pill bg-${categoryCounts[category] > 0 ? "primary" : "danger"}`}
                        style={{ top: "99px", fontSize: ".8rem",  }}
                      >
                        {`${categoryCounts[category] || 0}`}
                      </span></a> 
                  </li>
                ))}
              </ul>
            </div>
                
            {/* Dropdown + Hamburger */}
            <div className="col-12 col-md-3 d-flex justify-content-md-end align-items-center gap-2">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ minWidth: '150px', cursor: "pointer" }}
                >
                  {activeQuarter}
                </button>
                <ul className="dropdown-menu">
                  {isAdmin&&<li>
                    <a className="dropdown-item" onClick={openModal}>
                      ➕ Add new quarter
                    </a>
                  </li>}

                  <li><hr className="dropdown-divider" /></li>

                  {quarters.map((quarter, index) => (
                    <li key={index}>
                      <a
                        className="dropdown-item"
                        onClick={() => handleSelectQuarter(quarter)}
                        style={{cursor:"pointer"}}
                      >
                        {quarter}
                      </a>
                    </li>
                  ))}

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <a
                      className="dropdown-item"
                      href="https://es-homepage.excelindia.com/es-homepage/"
                    >
                      more...
                    </a>
                  </li>
                </ul>
              </div>

              <button
                className="btn p-2 border-0"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#quickLinksMenu"
                aria-controls="quickLinksMenu"
              >
                <span className="navbar-toggler-icon custom-toggler-white"></span>
              </button>
            </div>
          </div>
        </div>
        <QuickLinksMenu SetLoading={SetLoading} />
      </section>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAddNewQuarter}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add New Quarter
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="new-quarter" className="col-form-label">
                    New Quarter:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="new-quarter"
                    placeholder="e.g., 2025Q1"
                    value={newQuarter}
                    onChange={(e) => setNewQuarter(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ height: "4rem" }}>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderLayout;