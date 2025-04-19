import { useState } from "react";
import { useAuth } from "../context/Authcontext";


const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
  
  

  const handleLogin = () => {
    const user = users[username.toLowerCase()];
    if (user && user.password === password) {
      login(user);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <>
      <h1 class="display-1 tex text-center">LOGIN for HR console</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          background: "#f4f2f2",
          margin: "auto",
          marginTop: "4%",
        }}
        className="border p-4 rounded"
      >
        <div className="mb-4">
          <label for="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your anything with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "10%",
          }}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Login;
