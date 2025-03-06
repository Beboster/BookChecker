import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookPrices, setBookPrices] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const response = await axios.get('https://openlibrary.org/search.json', {
        params: { q: searchQuery },
      });

      if (response.status === 200) {
        setBooks(response.data.docs.slice(0, 10)); // Limit to 10 results
      } else {
        setError('Failed to fetch book data.');
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookPrice = async (isbn) => {
    try {
      const response = await axios.get('https://api.amazon.com/product', {
        params: {
          isbn: isbn,
          apiKey: 'YOUR_API_KEY', // Replace with your API key
        },
      });
  
      if (response.status === 200) {
        return response.data.price; // Assuming the price is returned in the 'price' field
      }
    } catch (error) {
      console.error('Error fetching price from Amazon:', error);
      return 'Price not available';
    }
  };

  const handleMouseEnter = (isbn) => {
    // Fetch price data when hovering over a book
    if (!bookPrices[isbn]) {
      fetchBookPrice(isbn);
    }
  };

  return (
    <div className="App">
      <h1>Book Checker</h1>

      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search for a book..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          required 
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="book-list">
        {books.length > 0 && books.map((book, index) => {
          const coverId = book.isbn ? book.isbn[0] : book.cover_edition_key;
          const coverUrl = book.isbn 
            ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
            : coverId 
              ? `https://covers.openlibrary.org/b/olid/${coverId}-M.jpg`
              : 'https://via.placeholder.com/150x200?text=No+Cover';

          return (
            <div 
              className="book-card" 
              key={index}
              onMouseEnter={() => handleMouseEnter(book.isbn ? book.isbn[0] : book.cover_edition_key)}
            >
              <img 
                src={coverUrl} 
                alt={`${book.title} cover`} 
                className="book-cover"
              />
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
              <p><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</p>
              {bookPrices[book.isbn ? book.isbn[0] : book.cover_edition_key] && (
                <p><strong>Price:</strong> ${bookPrices[book.isbn ? book.isbn[0] : book.cover_edition_key]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
