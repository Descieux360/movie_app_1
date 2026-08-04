import React, { useEffect } from 'react';
import { getPosterUrl } from '../utils/getPoster';

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

 
  const title = movie.title || movie.searchTerm || 'Untitled';
  const overview = movie.overview || 'No overview available for this movie.';
  
  const voteAverage = movie.vote_average !== undefined && movie.vote_average !== null 
    ? Number(movie.vote_average).toFixed(1) 
    : 'N/A';

  const releaseDate = movie.release_date || '';
  const language = movie.original_language || 'EN';

const posterSrc = getPosterUrl(movie.poster_path, movie.poster_url);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative flex h-auto max-h-[85vh] w-full max-w-2xl flex-col md:flex-row overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className=" cursor-pointer absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          ✕
        </button>

        {/* Poster */}
        <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-auto md:aspect-[2/3] shrink-0 bg-gray-800">
          <img src={posterSrc} alt={title} className="h-full w-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6 min-h-0 overflow-hidden">
          <div className="flex flex-col min-h-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 pr-6 line-clamp-2">
              {title}
            </h2>
            
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-3 shrink-0">
              <div className="flex items-center gap-1">
                <img src="/star.svg" alt="star icon" className="h-4 w-4" />
                <span className="font-semibold text-white">{voteAverage}</span>
              </div>
              <span>•</span>
              <span className="uppercase">{language}</span>
              <span>•</span>
              <span>{releaseDate ? releaseDate.split('-')[0] : 'N/A'}</span>
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-1 shrink-0">
              Overview
            </h4>

            <div className="overflow-y-auto text-xs sm:text-sm text-gray-400 leading-relaxed pr-2">
              <p>{overview}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer mt-4 shrink-0 w-full rounded-lg bg-red-600 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;