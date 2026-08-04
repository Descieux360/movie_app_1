
export const getPosterUrl = (posterPath, posterUrl) => {
  const isPlaceholder = 
    !posterUrl || 
    posterUrl.includes('placeholder.com') || 
    posterUrl.includes('via.placeholder') ||
    posterUrl === '/no-movie.png' ||
    posterUrl === '/no-movie.jpg';

  if (!isPlaceholder) {
    return posterUrl;
  }

  if (posterPath) {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  return '/no-movie.png';
};