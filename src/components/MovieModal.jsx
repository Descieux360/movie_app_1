import React, { useEffect } from 'react';

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  // Close modal when user presses the Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const { title, vote_average, poster_path, release_date, original_language, overview } = movie;

  return (
    /* Backdrop - Click outside to close */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Modal Container - Click inside won't close */}
      <div 
        className="relative flex w-full max-w-2xl flex-col md:flex-row overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          ✕
        </button>

        {/* Poster */}
        <div className="w-full md:w-1/2 aspect-[2/3] shrink-0 bg-gray-800">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : '/no-movie.jpg'
            }
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details Content */}
        <div className="flex flex-col justify-between p-6 md:w-1/2">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <img src="/star.svg" alt="star icon" className="h-4 w-4" />
                <span className="font-semibold text-white">
                  {vote_average ? vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
              <span>•</span>
              <span className="uppercase">{original_language}</span>
              <span>•</span>
              <span>{release_date ? release_date.split('-')[0] : 'N/A'}</span>
            </div>

            <h4 className="text-sm font-semibold text-gray-300 mb-1">Overview</h4>
            <p className="text-sm text-gray-400 leading-relaxed max-h-48 overflow-y-auto">
              {overview || 'No overview available for this movie.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-red-600 py-2.5 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;