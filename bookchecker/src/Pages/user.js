import React from "react";

function Login() {
  return (
  <><h1>This will be the login screen</h1><div className="login-container"></div><form className="login-form">
          <h2>Login</h2>

          

          <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
      </form></>
  );
}

export default Login;
