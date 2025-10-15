import { useState } from 'react'
import './App.css'

function Book({ title, author, image, isSelected, onSelect }) {
  const handleBookClick = () => {
    onSelect();
  };

  return (
    <div 
      className={`book ${isSelected ? 'selected' : ''}`}
      onClick={handleBookClick}
    >
      {image && <img src={image} alt={title} className="book-image" />}
      <h3>{title}</h3>
      {author && <p className="author">by {author}</p>}
    </div>
  )
}

function AddBookModal({ isOpen, onClose, onAddBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    url: ''
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
    // Add the new book
    onAddBook({
      title: formData.title,
      author: formData.author,
      image: formData.url,
      selected: false
    });
    onClose();
    // Reset form
    setFormData({
      title: '',
      author: '',
      url: ''
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
            <label htmlFor="url">Cover Image URL:</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.png"
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
  // Start with empty books array - books only appear when added
  const [books, setBooks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddBook = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAddNewBook = (newBook) => {
    const bookWithId = {
      ...newBook,
      id: Date.now() + Math.random(),
      selected: false
    }
    setBooks([...books, bookWithId])
  }

  const handleBookSelect = (bookId) => {
    // Deselect all books first, then select the clicked one
    setBooks(books.map(book => ({
      ...book,
      selected: book.id === bookId ? !book.selected : false
    })))
  }

  const handleDeleteSelected = () => {
    setBooks(books.filter(book => !book.selected))
  }

  const handleUpdateSelected = () => {
    // No-op for now
    console.log('Update button clicked')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Sarah's Awesome Book Catalog</h1>
      </header>
      
      <main className="main-content">
        <div className="container">
          <div className="controls">
            <div className="add-book-card" onClick={handleAddBook}>
              <div className="add-book-text">Add Book +</div>
            </div>
            <div className="action-buttons">
              <button className="edit-button" onClick={handleUpdateSelected}>
                Edit
              </button>
              <button className="delete-button" onClick={handleDeleteSelected}>
                Delete
              </button>
            </div>
          </div>
          <div className="books-grid">
            {books.map((book) => (
              <Book 
                key={book.id} 
                title={book.title} 
                author={book.author}
                image={book.image}
                isSelected={book.selected}
                onSelect={() => handleBookSelect(book.id)}
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
        onAddBook={handleAddNewBook}
      />
    </div>
  )
}

export default App
