import { Databases, ID, Query, Client } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client();
client
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/no-movie.jpg';

    // Safely extract and format metrics
    const title = movie.title || searchTerm || 'Untitled';
    const overview = movie.overview || 'No overview available.';
    const voteAverage = typeof movie.vote_average === 'number' ? Math.round(movie.vote_average) : 0;
    const releaseDate = movie.release_date || '';
    const originalLanguage = movie.original_language || 'en';

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
        movie_id: movie.id,
        title: title,
        poster_url: posterUrl,
        overview: overview,
        vote_average: voteAverage,
        release_date: releaseDate,
        original_language: originalLanguage,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        title: title,
        poster_url: posterUrl,
        overview: overview,
        vote_average: voteAverage,
        release_date: releaseDate,
        original_language: originalLanguage,
      });
    }
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('count'),
      Query.limit(5),
    ]);
    return result.documents;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
  }
};