import React, { useState } from 'react';

function Footer({ canPublish, downloadAllEmployeesOfQuarter, publishBtn, logout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {/* Glass Footer */}
      <footer className="glass-footer" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center' }}>
        <button
          className="glass-btn"
          onClick={downloadAllEmployeesOfQuarter}
          aria-label="Download All Employees of the Quarter"
        >
          <i className="fa fa-download" aria-hidden="true"></i> Download
        </button>

        {canPublish && (
          <button
            className="glass-btn"
            onClick={publishBtn}
            aria-label="Publish"
          >
            <i className="fa fa-upload" aria-hidden="true"></i> Publish
          </button>
        )}

        <button
          className="glass-btn"
          onClick={() => setShowLogoutModal(true)}
          aria-label="Logout"
        >
          <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
        </button>
      </footer>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="glass-modal" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div style={{
            background: 'rgba(30, 30, 30, 0.85)', padding: 32, borderRadius: 16,
            minWidth: 320, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)'
          }}>
            <h2 style={{ marginBottom: 16 }}>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 24 }}>
              <button
                className="glass-btn"
                onClick={() => setShowLogoutModal(false)}
                aria-label="Cancel Logout"
              >
                Cancel
              </button>
              <button
                className="glass-btn"
                style={{ background: 'rgba(255, 90, 90, 0.25)', color: '#fff' }}
                onClick={logout}
                aria-label="Confirm Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
