import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

console.log('Hi there!')
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [bookPrices, setBookPrices] = useState({}); // Stores book prices by ISBN
=======
  const [bookPrices, setBookPrices] = useState({});
>>>>>>> 53e6976e4d6d47f36ef5d0c09ef00b7dac41aba4

  // Fetch price for a single book using its ISBN
  const fetchGoogleBookPrice = async (isbn) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyCPtnmiLTDsWME2x2DYeJcARU6EQMSxL4A`);
      if (response.data.items && response.data.items.length > 0) {
        const bookData = response.data.items[0];
        const saleInfo = bookData.saleInfo;

        return saleInfo && saleInfo.retailPrice 
          ? { price: `${saleInfo.retailPrice.amount} ${saleInfo.retailPrice.currencyCode}`, buyLink: saleInfo.buyLink }
          : { price: 'Price not available', buyLink: '#' };
          
      }
      return { price: 'Price not available', buyLink: '#' };
    } catch (error) {
      console.error('Error fetching price:', error);
      return { price: 'Error fetching price', buyLink: '#' };
    }
    
  };
 


  // Triggered when the user searches for books
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBooks([]);
    setBookPrices({}); // Clear previous book prices

    try {
      const response = await axios.get('https://openlibrary.org/search.json', {
        params: { q: searchQuery },
      });

      if (response.status === 200) {
        const booksData = response.data.docs.slice(0, 10); // Limit to 10 results
        setBooks(booksData);

        // Fetch prices for each book that has an ISBN
        booksData.forEach(async (book) => {
          if (book.isbn && book.isbn.length > 0) {
            const isbn = book.isbn[0];
            const priceData = await fetchGoogleBookPrice(isbn);
            setBookPrices((prevPrices) => ({ ...prevPrices, [isbn]: priceData }));
            console.log('These are the prices, $',priceData);
          }
        });
      } else {
        setError('Failed to fetch book data.');
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
  
=======

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

>>>>>>> 53e6976e4d6d47f36ef5d0c09ef00b7dac41aba4
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
<<<<<<< HEAD
              <p><strong>Price:</strong> {bookPrice}</p>
              {buyLink !== '#' && <a href={buyLink} target="_blank" rel="noopener noreferrer">Buy this book</a>}
=======
              {bookPrices[book.isbn ? book.isbn[0] : book.cover_edition_key] && (
                <p><strong>Price:</strong> ${bookPrices[book.isbn ? book.isbn[0] : book.cover_edition_key]}</p>
              )}
>>>>>>> 53e6976e4d6d47f36ef5d0c09ef00b7dac41aba4
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
