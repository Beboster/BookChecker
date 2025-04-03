import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
          <h2 className="logo">📚 Book Checker</h2>
          <div className="links">
          <Link to="/" className="link">Home</Link>
            <Link to="/about" className="link">About</Link>
            <Link to="/library" className="link">Library</Link>
          </div>
        </nav>
      );
    }
    

export default Navbar;