import { useEffect, useRef, useState, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 12;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    resetSearch()
  }

  const handleSelection = (selection) => {
    searchInput.current.value = selection
    resetSearch()
  }

  const resetSearch = () => {
    fetchImages()
    setPage(1)
  }

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setLoading(true)
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`
        )
        setImages(data.results)
        setTotalPages(data.total_pages)
        setLoading(false)
      }
    } catch (error) {
      setErrorMessage(`${error.message}. Try again later.`)
      console.error(error.message)
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>

      <section className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            name="searchBar"
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </section>

      <div className="filters">
        <div onClick={() => handleSelection('nature')}>Nature</div>
        <div onClick={() => handleSelection('birds')}>Birds</div>
        <div onClick={() => handleSelection('cats')}>Cats</div>
        <div onClick={() => handleSelection('shoes')}>Shoes</div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <section className="images">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className="image"
              />
            ))}
          </section>
          
          <div className="buttons">
            {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
            {page < totalPages && <Button onClick={() => setPage(page + 1)}>Next</Button>}
          </div>
        </>
      )}

      <span className="error-msg">{errorMessage}</span>

    </div>
  )
}

export default App
