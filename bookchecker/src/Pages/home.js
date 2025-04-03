import React, { useState } from "react";

const BookChecker = ({ books, loading, error, bookPrices, handleSearch, searchQuery, setSearchQuery, handleMouseEnter }) => {
  return (
    <div className="App">
      <h1>Book Checker</h1>
      <img 
        src="/magic-library.png"  // Fix path issue (public assets should be referenced like this)
        alt="Magical Library" 
        style={{ width: "100%", maxWidth: "1000px", maxHeight: "300px", display: "rectangle", margin: "auto" }}
      />

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

          const isbn = book.isbn ? book.isbn[0] : null;
          const bookPrice = isbn && bookPrices[isbn] ? bookPrices[isbn].price : 'Fetching price...';
          const buyLink = isbn && bookPrices[isbn] ? bookPrices[isbn].buyLink : '#';

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
                <p><strong>Price:</strong> {bookPrices[book.isbn ? book.isbn[0] : book.cover_edition_key]?.price || "Fetching price..."}</p>

              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookChecker;
