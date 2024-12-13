import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Optional CSS for styling

const App = () => {
  // State hooks for search input, book data, and loading/error states
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the search form submission
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setLoading(true);
    setError(null);
    setBooks([]); // Clear previous results

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

  return (
    <div className="App">
      <h1>📚 Book Checker</h1>

      {/* Search Form */}
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

      {/* Display Book Results */}
      <div className="book-list">
        {books.length > 0 && books.map((book, index) => (
          <div className="book-card" key={index}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
            <p><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;