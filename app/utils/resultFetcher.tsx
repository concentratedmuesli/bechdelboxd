import type { mergedItem } from ".react-router/types/mergedItems";
import { useEffect } from "react";

export const getResultData = async (letterboxdHandle: string): Promise<mergedItem[]> => {
  try {
  const CORS_PROXY = 'https://corsproxy.io/?';
  const RSS_URL = `https://letterboxd.com/${letterboxdHandle}/rss/`;
  
  const allMovies = await import('../allMovies.json');
  const allMoviesArray = allMovies.default;

  const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
  const xmlText = await response.text();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const items: any[] = [];
  const itemElements = xmlDoc.getElementsByTagName('item');

  function extractImageFromDescription(description: string | undefined): string | null {
    if (!description) return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(description, 'text/html');
      const img = doc.querySelector('img');
      return img ? img.src : null;
    } catch (error) {
      console.error('Error parsing description:', error);
      return null;
    }
  };

  // the RSS feed shows the 50 latest watched movies,
  // and then movie lists made by other users that the user follows,
  // which is not relevant for this app so I'm leaving them out
  for (let i = 0; i < 50; i++) {
    const item = itemElements[i];
    const description = item.getElementsByTagName('description')[0]?.textContent;
    const title = item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent;
    const year = item.getElementsByTagName('letterboxd:filmYear')[0]?.textContent;
    const rating = item.getElementsByTagName('letterboxd:memberRating')[0]?.textContent;
    const watchedDate = item.getElementsByTagName('letterboxd:watchedDate')[0]?.textContent;
    const link = item.getElementsByTagName('link')[0]?.textContent;
    const tmdbId = item.getElementsByTagName('tmdb:movieId')[0]?.textContent;
    const imageUrl = extractImageFromDescription(description);

    items.push({
      title: (/^The\s+/i.test(title) ? title.replace(/^The\s+(.+)/i, '$1, The') : title),
      year: parseInt(year),
      rating: rating,
      watchedDate: watchedDate,
      link: link,
      tmdbId: tmdbId,
      imageUrl: imageUrl
    });
  }

  const mergedItems: mergedItem[] = items.map(item => {
    let matchingBechdelItem = allMoviesArray.find(movie => {
      return movie.year === item.year && movie.title === item.title;
    });

    return {
      ...item,
      bechdelRating: matchingBechdelItem?.rating,
      imdbId: matchingBechdelItem?.imdbid
    };
  });
  return mergedItems;
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
    throw error;
  }
};
