import { useState } from "react";
import { useAuth } from "../context/Authcontext";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const users = {
    admin: {
      username: process.env.REACT_APP_ADMIN_USER,
      password: process.env.REACT_APP_ADMIN_PASS,
      role: "admin"
    },
    hr: {
      username: process.env.REACT_APP_HR_USER,
      password: process.env.REACT_APP_HR_PASS,
      role: "publisher"
    },
    view: {
      username: process.env.REACT_APP_VIEWER_USER,
      password: process.env.REACT_APP_VIEWER_PASS,
      role: "viewer"
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    // Add a small delay to simulate authentication process
    setTimeout(() => {
      const user = users[username.toLowerCase()];
      if (user && user.password === password) {
        login(user);
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "300",
          color: "#495057",
          marginBottom: "10px"
        }}>
          Incentive Management Console
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "#6c757d",
          margin: 0
        }}>
          Please sign in to access your account
        </p>
      </div>

      {/* Login Card */}
      <div className="card" style={{
        width: "100%",
        maxWidth: "400px",
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "10px"
      }}>
        <div className="card-header" style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #dee2e6",
          padding: "25px 30px 20px",
          borderRadius: "10px 10px 0 0"
        }}>
          <h5 className="card-title text-center" style={{
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#495057"
          }}>
            Sign In
          </h5>
        </div>

        <div className="card-body" style={{ padding: "30px" }}>
          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger" style={{
                fontSize: "0.9rem",
                padding: "10px 15px",
                marginBottom: "20px",
                borderRadius: "6px"
              }}>
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="form-label" style={{
                fontWeight: "500",
                color: "#495057",
                marginBottom: "8px"
              }}>
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(""); // Clear error when user types
                }}
                disabled={isLoading}
                style={{
                  padding: "12px 16px",
                  fontSize: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ced4da"
                }}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label" style={{
                fontWeight: "500",
                color: "#495057",
                marginBottom: "8px"
              }}>
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error when user types
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                style={{
                  padding: "12px 16px",
                  fontSize: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ced4da"
                }}
              />
              <div className="form-text" style={{
                fontSize: "0.85rem",
                color: "#6c757d",
                marginTop: "5px"
              }}>
                Press Enter to sign in quickly
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleLogin}
              disabled={isLoading}
              style={{
                padding: "12px",
                fontSize: "1rem",
                fontWeight: "500",
                borderRadius: "6px",
                backgroundColor: "#007bff",
                border: "none",
                transition: "all 0.2s ease"
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer" style={{
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #dee2e6",
          padding: "20px 30px",
          borderRadius: "0 0 10px 10px"
        }}>
          <div className="text-center">
            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
              Contact your administrator for access issues
            </small>
          </div>
        </div>
      </div>

      {/* Role Information */}
      <div className="mt-4 text-center">
        <small className="text-muted" style={{ fontSize: "0.8rem" }}>
          Available roles: Admin, HR, Viewer
        </small>
      </div>

      <style jsx>{`
        .form-control:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,123,255,0.3);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        
        .alert {
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Login;