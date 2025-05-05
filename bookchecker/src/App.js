import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './App.css';
import Navbar from "./Components/navbar"; // Optional
import About from "./Pages/about";
import Library from "./Pages/library";
import Home from "./Pages/home";
import Login from "./Pages/user"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


console.log("Hi there!");

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookPrices, setBookPrices] = useState({});

  // Fetch price for a single book using its ISBN
  const fetchGoogleBookPrice = async (isbn) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=YOUR_GOOGLE_API_KEY`
      );
      if (response.data.items && response.data.items.length > 0) {
        const bookData = response.data.items[0];
        const saleInfo = bookData.saleInfo;

        return saleInfo && saleInfo.retailPrice
          ? { price: `${saleInfo.retailPrice.amount} ${saleInfo.retailPrice.currencyCode}`, buyLink: saleInfo.buyLink }
          : { price: "Price not available", buyLink: "#" };
      }
      return { price: "Price not available", buyLink: "#" };
    } catch (error) {
      console.error("Error fetching price:", error);
      return { price: "Error fetching price", buyLink: "#" };
    }
  };

  // Search for books
  const handleSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    fetch(`https://openlibrary.org/search.json?q=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.docs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch books");
        setLoading(false);
      });
  };

  const handleMouseEnter = (isbn) => {
    if (isbn && !bookPrices[isbn]) {
      fetch(`https://api.example.com/book-price/${isbn}`)
        .then((response) => response.json())
        .then((data) => {
          setBookPrices((prevPrices) => ({
            ...prevPrices,
            [isbn]: { price: data.price, buyLink: data.buyLink },
          }));
        })
        .catch(() => {
          setBookPrices((prevPrices) => ({
            ...prevPrices,
            [isbn]: { price: "N/A", buyLink: "#" },
          }));
        });
    }
  };

  return (
    <Router>
      <Navbar /> {/* Navbar appears on all pages */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              books={books}
              loading={loading}
              error={error}
              bookPrices={bookPrices}
              handleSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleMouseEnter={handleMouseEnter}
            />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/library" element={<Library />} />
        <Route path="/user" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;