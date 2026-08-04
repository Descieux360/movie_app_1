import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import heroImg from '../public/hero.png'
import './input.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import MovieModal from './components/MovieModal.jsx'
import TrendingSkeleton from './components/TrendingSkeleton.jsx'
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {

  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );


  const fetchMovies = async ( query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try{

      const endpoint = query ? 
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : 
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error){
       console.error(`Error fetching movies: ${error}`);
       setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
       setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setIsTrendingLoading(true);
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error('Error loading trending movies:', error);
    } finally {
      setIsTrendingLoading(false); // Stop loading
    }
  }

  // const loadMoviesSkeleton = async () => {
  //   try {
  //     setIsTrendingLoading(true); // Start loading
  //     const movies = await getTrendingMovies();
  //     setTrendingMovies(movies || []);
  //   } catch (error) {
  //     console.error('Error loading trending movies:', error);
  //   } finally {
  //     setIsTrendingLoading(false); // Stop loading
  //   }
  // };

  useEffect(() => {
     fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
   <main>
    <div className='pattern' />

    <div className="wrapper">
      <header>
        <img src={heroImg} alt="Hero Banner"/>
        <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy
        Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      {/* Render Skeleton while loading */}
      {isTrendingLoading ? (
        <TrendingSkeleton />
      ) : trendingMovies.length > 0 && (
        <section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li 
                key={movie.$id || index} 
                onClick={() => setSelectedMovie(movie)} 
                className="cursor-pointer"
              >
                <p>{index + 1}</p>
                <img 
                  src={movie.poster_url} 
                  alt={movie.title} 
                  className="h-40 w-34 object-cover rounded-md" 
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className='all-movies'>
         <h2 className = 'mt-[40px]'>All movies</h2>

         {isLoading ? (
          <div><Spinner /></div>
         ) : errorMessage ? (
          <p className='text-red-500'>{errorMessage}</p>
         ) : (
          <ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
            ))}
          </ul>
         )
        } 
      </section>

      <MovieModal
        movie={selectedMovie} // Pass the selected movie
        onClose={() => setSelectedMovie(null)} // Close modal
      />  
      
    </div>
   </main>
  )
}

export default App
