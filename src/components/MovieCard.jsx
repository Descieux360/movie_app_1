import React, { useState } from 'react';

const MovieCard = ({ movie, onClick}) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(!poster_path);

  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null;

  return (
    <div onClick={onClick} className="movie-card flex flex-col rounded-xl bg-dark-100 p-4 shadow-sm">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
        
        
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 h-full w-full animate-pulse bg-gray-700" />
        )}

        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-800 p-4 text-center">
            <svg
              className="h-12 w-12 text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="text-xs font-medium text-gray-400 line-clamp-2">
              No Poster Available
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setHasError(true);
              setImageLoaded(true);
            }}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="line-clamp-1 text-base font-bold text-white">{title}</h3>

        <div className="content">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <img src="/star.svg" alt="star icon" className="h-4 w-4" />
              <p className="font-semibold text-white">
                {vote_average ? vote_average.toFixed(1) : 'N/A'}
              </p>
            </div>

            <span>•</span>

            <p className="lang uppercase font-medium">{original_language}</p>

            <span>•</span>

            <p className="year">
              {release_date ? release_date.split('-')[0] : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;