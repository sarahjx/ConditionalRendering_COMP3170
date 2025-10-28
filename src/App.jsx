import { useState, useEffect } from 'react'
import './App.css'

function Book({ title, author, image, publisher, isSelected, onSelect }) {
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
      {publisher && <p className="publisher">{publisher}</p>}
    </div>
  )
}

function BookModal({ isOpen, onClose, onSaveBook, bookToEdit, mode }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    url: ''
  });

  useEffect(() => {
    if (mode === 'edit' && bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        publisher: bookToEdit.publisher || '',
        url: bookToEdit.image || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        publisher: '',
        url: ''
      });
    }
  }, [bookToEdit, mode, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBook({
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      image: formData.url,
    });
    onClose();
    setFormData({
      title: '',
      author: '',
      publisher: '',
      url: ''
    });
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Book' : 'Add New Book'}</h2>
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
              placeholder="e.g., Penguin Random House"
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
              {mode === 'edit' ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  // Load books from localStorage or start with empty array
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books');
    return savedBooks ? JSON.parse(savedBooks) : [];
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [bookToEdit, setBookToEdit] = useState(null)
  const [filterPublisher, setFilterPublisher] = useState('all')

  // Save books to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleAddBook = () => {
    setModalMode('add');
    setBookToEdit(null);
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setBookToEdit(null);
  }

  const handleSaveBook = (bookData) => {
    if (modalMode === 'edit' && bookToEdit) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === bookToEdit.id 
          ? { ...book, ...bookData, selected: false }
          : book
      ))
    } else {
      // Add new book
      const bookWithId = {
        ...bookData,
        id: Date.now() + Math.random(),
        selected: false
      }
      setBooks([...books, bookWithId])
    }
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
    const selectedBook = books.find(book => book.selected);
    if (selectedBook) {
      setModalMode('edit');
      setBookToEdit(selectedBook);
      setIsModalOpen(true);
    }
  }

  // Get unique publishers for filter dropdown
  const publishers = ['all', ...new Set(books.map(book => book.publisher).filter(Boolean))];

  // Filter books based on selected publisher
  const filteredBooks = filterPublisher === 'all'
    ? books
    : books.filter(book => book.publisher === filterPublisher);

  return (
    <div className="app">
      <header className="header">
        <h1>Sarah's Awesome Book Catalog</h1>
        <div className="filter-container">
          <label htmlFor="publisher-filter" className="filter-label">
            Filter by Publisher:
          </label>
          <select
            id="publisher-filter"
            className="filter-select"
            value={filterPublisher}
            onChange={(e) => setFilterPublisher(e.target.value)}
          >
            {publishers.map(publisher => (
              <option key={publisher} value={publisher}>
                {publisher === 'all' ? 'All Publishers' : publisher}
              </option>
            ))}
          </select>
        </div>
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
            {filteredBooks.length === 0 ? (
              <div className="no-books-message">
                <p>No books to display{filterPublisher !== 'all' && ` for ${filterPublisher}`}</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <Book 
                  key={book.id} 
                  title={book.title} 
                  author={book.author}
                  image={book.image}
                  publisher={book.publisher}
                  isSelected={book.selected}
                  onSelect={() => handleBookSelect(book.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 Sarah's Book Catalog</p>
      </footer>

      <BookModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSaveBook={handleSaveBook}
        bookToEdit={bookToEdit}
        mode={modalMode}
      />
    </div>
  )
}

export default App
