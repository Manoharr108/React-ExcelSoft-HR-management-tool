import React from 'react';
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
  publishstatus
}) {
  const { isAdmin, canPublish } = useAuth();

  return (
    <section className="navigation bg-rr1 bg-rr">
      <nav className="navbar navbar-dark">
        <div className="container-fluid justify-content-between">
          <div className="d-flex flex-column flex-md-row flex-wrap">
            <a className="navbar-brand" href="#">
              <img
                src="/ES-White-logo.png"
                width="auto"
                height="50px"
                alt="Excelsoft Logo"
              />
            </a>
            <div className="text-white border-start ps-2 ms-1 d-flex flex-column">
             <span className="fs-5 fs-md-3 fs-lg-2 fs-xl-1 fw-semibold">
                Rewards and Recognition Award Winners - Management Console&nbsp;
                <span style={{ color: publishstatus ? 'Green' : 'red' }}>
                  ({publishstatus ? 'Published' : 'Not Published'})
                </span>
              </span>
              <div id="active-quarter" onClick={() => console.log('Quarter Clicked')}>
                {activeQuarter}
              </div>
            </div>
          </div>
        </div>
      </nav>

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
                      className={`position-absolute top-1 start-5 translate-middle badge rounded-pill bg-${categoryCounts[category] > 0 ? "primary" : "danger"}`}
                      style={{ top: "90px", fontSize: ".8rem" }}
                    >
                      {`${categoryCounts[category] || 0}`}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dropdown + Hamburger */}
          <div className="col-12 col-md-3 d-flex justify-content-md-end align-items-center gap-2">
            <select
              id="quarter-dropdown"
              className="form-select"
              style={{ minWidth: '150px' , cursor:"pointer"}}
              value={activeQuarter}
              onChange={(e) => {
    if (e.target.value === "more") {
      window.location.href = "https://es-homepage.excelindia.com/es-homepage/";
    } else {
      handleSelectQuarter(e.target.value);
    }
  }}
            >
              {quarters.map((quarter, index) => (
                <option key={index} value={quarter}>
                  {quarter}
                </option>
              ))
              }
              <option value="more">more</option>
            </select>

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
  );
}

export default HeaderLayout;
