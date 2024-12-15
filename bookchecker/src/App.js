import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          // Prioritize the use of ISBN, then cover_edition_key, as a fallback
          const coverId = book.isbn ? book.isbn[0] : book.cover_edition_key;
          const coverUrl = book.isbn 
            ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
            : coverId 
              ? `https://covers.openlibrary.org/b/olid/${coverId}-M.jpg`
              : 'https://via.placeholder.com/150x200?text=No+Cover';

          return (
            <div className="book-card" key={index}>
              <img 
                src={coverUrl} 
                alt={`${book.title} cover`} 
                className="book-cover"
              />
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
              <p><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
