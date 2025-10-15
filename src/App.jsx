import { useState } from 'react'
import booksData from './data/books.json'
import './App.css'

function Book({ title, price, subtitle, image, url, isbn13, isSelected, onSelect, onRemove }) {
  const handleBookClick = (e) => {
    // Prevent selection when clicking on remove button or learn more link
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
      return;
    }
    onSelect(isbn13);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(isbn13);
  };

  return (
    <div 
      className={`book ${isSelected ? 'selected' : ''}`}
      onClick={handleBookClick}
    >
      {image && <img src={image} alt={title} className="book-image" />}
      <h3>{title}</h3>
      <p className="price">{price}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="learn-more">Learn more</a>
      <button className="remove-button" onClick={handleRemove}>
        Remove
      </button>
    </div>
  )
}

function AddBookModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publicationYear: '',
    language: '',
    pages: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the form data and close modal
    console.log('New book data:', formData);
    onClose();
    // Reset form
    setFormData({
      title: '',
      author: '',
      publisher: '',
      publicationYear: '',
      language: '',
      pages: ''
    });
  };

  const handleModalClick = (e) => {
    // Close modal when clicking on backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publisher">Publisher:</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publicationYear">Publication Year:</label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleInputChange}
              min="1000"
              max="2025"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pages">Pages:</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [books, setBooks] = useState(booksData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState(null)

  const handleAddBook = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBookSelect = (bookId) => {
    setSelectedBookId(selectedBookId === bookId ? null : bookId)
  }

  const handleBookRemove = (bookId) => {
    setBooks(books.filter(book => book.isbn13 !== bookId))
    // Deselect if the removed book was selected
    if (selectedBookId === bookId) {
      setSelectedBookId(null)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Sarah's Awesome Book Catalog</h1>
      </header>
      
      <main className="main-content">
        <div className="container">
          <div className="add-book-card" onClick={handleAddBook}>
            <div className="add-book-text">Add Book +</div>
          </div>
          <div className="books-grid">
            {books.map((book) => (
              <Book 
                key={book.isbn13} 
                title={book.title} 
                price={book.price}
                subtitle={book.subtitle}
                image={book.image}
                url={book.url}
                isbn13={book.isbn13}
                isSelected={selectedBookId === book.isbn13}
                onSelect={handleBookSelect}
                onRemove={handleBookRemove}
              />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 Sarah's Book Catalog</p>
      </footer>

      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  )
}

export default App
