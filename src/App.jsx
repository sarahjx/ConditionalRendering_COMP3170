import { useState, useEffect } from 'react'
import './App.css'
import sampleBooks from './data/books.json'

function Book({ title, author, image, publisher, price, published, pages, url, isSelected, onSelect, isOnLoan }) {
  const handleBookClick = () => {
    onSelect();
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`book ${isSelected ? 'selected' : ''} ${isOnLoan ? 'on-loan' : ''}`}
      onClick={handleBookClick}
    >
      {image && <img src={image} alt={title} className="book-image" />}
      <h3>{title}</h3>
      <p className="author">{author || 'Unknown Author'}</p>
      <p className="published-info">
        Published: {published || '2025'} • {pages || 499} pages
      </p>
      {price && <p className="price">{price}</p>}
      {url ? (
        <a 
          href={url} 
          className="learn-more" 
          onClick={handleViewDetails}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Details
        </a>
      ) : (
        <span className="learn-more">View Details</span>
      )}
      {isOnLoan && <p className="loan-status">On Loan</p>}
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

function LoanManagement({ books, loans, onAddLoan }) {
  const [formData, setFormData] = useState({
    borrower: '',
    bookId: '',
    loanPeriod: 1
  });

  // Get available books (not currently on loan)
  const availableBooks = books.filter(book => {
    return !loans.some(loan => loan.bookId === book.id);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'loanPeriod' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.borrower && formData.bookId) {
      // Convert bookId to number to match book.id type
      const bookId = typeof formData.bookId === 'string' 
        ? parseFloat(formData.bookId) 
        : formData.bookId;
      
      onAddLoan({
        borrower: formData.borrower,
        bookId: bookId,
        loanPeriod: formData.loanPeriod,
        loanDate: new Date().toISOString()
      });
      setFormData({
        borrower: '',
        bookId: '',
        loanPeriod: 1
      });
    }
  };

  // Get loaned books with full details
  const loanedBooksList = loans.map(loan => {
    const book = books.find(b => b.id === loan.bookId);
    if (!book) return null;
    
    const loanDate = new Date(loan.loanDate);
    const dueDate = new Date(loanDate);
    dueDate.setDate(dueDate.getDate() + (loan.loanPeriod * 7));
    
    return {
      ...loan,
      bookTitle: book.title,
      dueDate: dueDate.toLocaleDateString()
    };
  }).filter(Boolean);

  return (
    <div className="loan-management">
      <h2>Loan Management</h2>
      
      {availableBooks.length > 0 ? (
        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label htmlFor="borrower">Borrower Name:</label>
            <input
              type="text"
              id="borrower"
              name="borrower"
              value={formData.borrower}
              onChange={handleInputChange}
              required
              placeholder="Enter borrower's name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bookId">Book:</label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a book</option>
              {availableBooks.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="loanPeriod">Loan Period (weeks):</label>
            <input
              type="number"
              id="loanPeriod"
              name="loanPeriod"
              value={formData.loanPeriod}
              onChange={handleInputChange}
              min="1"
              max="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Create Loan
            </button>
          </div>
        </form>
      ) : (
        <div className="no-books-message">
          <p>All books are currently on loan.</p>
        </div>
      )}
      
      <div className="loaned-books-section">
        <h3>Loaned Books</h3>
        {loanedBooksList.length > 0 ? (
          <div className="loaned-books-list">
            {loanedBooksList.map((loan, index) => (
              <div key={index} className="loaned-book-item">
                <p><strong>Borrower:</strong> {loan.borrower}</p>
                <p><strong>Book:</strong> {loan.bookTitle}</p>
                <p><strong>Due Date:</strong> {loan.dueDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-loans-message">
            <p>No books are currently on loan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  // Load books from localStorage or initialize with sample books
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      const parsed = JSON.parse(savedBooks);
      // If localStorage has books, use them; otherwise initialize with sample books
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
    // Initialize with sample books from books.json
    // Page counts: 499, 510, 357, 420, 380, 450, 365, 395, 410, 340
    const pageCounts = [499, 510, 357, 420, 380, 450, 365, 395, 410, 340];
    return sampleBooks.map((book, index) => ({
      id: Date.now() + index,
      title: book.title,
      author: book.subtitle || '',
      publisher: '',
      image: book.image,
      price: book.price || '',
      published: '2025',
      pages: pageCounts[index] || 499,
      url: book.url || '',
      selected: false
    }));
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [bookToEdit, setBookToEdit] = useState(null)
  const [filterPublisher, setFilterPublisher] = useState('all')
  const [currentView, setCurrentView] = useState('books') // 'books' or 'loans'
  
  // Load loans from localStorage or start with empty array
  const [loans, setLoans] = useState(() => {
    const savedLoans = localStorage.getItem('loans');
    return savedLoans ? JSON.parse(savedLoans) : [];
  })

  // Initialize sample books on first mount if books array is empty
  useEffect(() => {
    // Check if we have no books (either from localStorage being empty or having empty array)
    if (books.length === 0) {
      // Page counts: 499, 510, 357, 420, 380, 450, 365, 395, 410, 340
      const pageCounts = [499, 510, 357, 420, 380, 450, 365, 395, 410, 340];
      const initializedBooks = sampleBooks.map((book, index) => ({
        id: Date.now() + index,
        title: book.title,
        author: book.subtitle || '',
        publisher: '',
        image: book.image,
        price: book.price || '',
        published: '2025',
        pages: pageCounts[index] || 499,
        url: book.url || '',
        selected: false
      }));
      setBooks(initializedBooks);
    } else {
      // Migrate existing books to add missing fields
      const pageCounts = [499, 510, 357, 420, 380, 450, 365, 395, 410, 340];
      const updatedBooks = books.map((book, index) => {
        // Find matching sample book if available
        const sampleBook = sampleBooks.find(sb => sb.title === book.title);
        return {
          ...book,
          price: book.price || sampleBook?.price || '',
          published: book.published || '2025',
          pages: book.pages || pageCounts[index % pageCounts.length] || 499,
          url: book.url || sampleBook?.url || ''
        };
      });
      // Only update if something changed
      if (JSON.stringify(books) !== JSON.stringify(updatedBooks)) {
        setBooks(updatedBooks);
      }
    }
  }, []); // Run only on mount

  // Save books to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  // Save loans to localStorage whenever loans change
  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

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

  // Handle adding a new loan
  const handleAddLoan = (loanData) => {
    setLoans([...loans, loanData]);
  };

  // Check if a book is on loan
  const isBookOnLoan = (bookId) => {
    return loans.some(loan => {
      // Compare as both string and number to handle type mismatches
      return loan.bookId == bookId; // Use == for type coercion
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Sarah's Awesome Book Catalog</h1>
        <div className="header-controls">
          <div className="filter-container">
            <label htmlFor="publisher-filter" className="filter-label">
              Filter by Publisher:
            </label>
            <select
              id="publisher-filter"
              className="filter-select"
              value={filterPublisher}
              onChange={(e) => setFilterPublisher(e.target.value)}
              disabled={currentView === 'loans'}
            >
              {publishers.map(publisher => (
                <option key={publisher} value={publisher}>
                  {publisher === 'all' ? 'All Publishers' : publisher}
                </option>
              ))}
            </select>
          </div>
          <div className="view-toggle">
            <button 
              className={`view-button ${currentView === 'books' ? 'active' : ''}`}
              onClick={() => setCurrentView('books')}
            >
              Book Listing
            </button>
            <button 
              className={`view-button ${currentView === 'loans' ? 'active' : ''}`}
              onClick={() => setCurrentView('loans')}
            >
              Loan Management
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {currentView === 'books' ? (
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
                    price={book.price}
                    published={book.published}
                    pages={book.pages}
                    url={book.url}
                    isSelected={book.selected}
                    onSelect={() => handleBookSelect(book.id)}
                    isOnLoan={isBookOnLoan(book.id)}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="loan-management-container">
            <LoanManagement 
              books={books} 
              loans={loans} 
              onAddLoan={handleAddLoan}
            />
          </div>
        )}
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
