import React from 'react';

const TrendingSkeleton = () => {
  // Array of 5 items to match the Query.limit(5)
  const skeletonItems = Array.from({ length: 5 });

  return (
    <section className="trending">
      <h2>Trending Movies</h2>
      <ul>
        {skeletonItems.map((_, index) => (
          <li key={index} className="animate-pulse flex items-center gap-2">
            {/* Number placeholder */}
            <div className="h-6 w-4 rounded bg-gray-800" />
            
            {/* Poster placeholder matching h-40 w-34 */}
            <div className="h-40 w-34 rounded-md bg-gray-800" />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrendingSkeleton;