import type { bechdelItem, omdbAPIResponse } from '~/interfaces/items';
import type { mergedBechdelItem } from '~/interfaces/items';
import { escape, unescape } from 'html-escaper';


const fetchPosterAndTitle = async (item: bechdelItem, key: string): Promise<{ imageUrl: string, title: string; }> => {
  const response = await fetch(`https://www.omdbapi.com/?i=tt${item.imdbid}&h=600&apikey=${key}`);
  const data: omdbAPIResponse = await response.json();
  const imageUrl = data.Poster;
  const title = data.Title;
  return { imageUrl, title };
};

export const GetRandomPassingFilms = async (): Promise<mergedBechdelItem[]> => {
  try {
    const key = "1afcc41f";
    const randomList: bechdelItem[] = [];
    const allMoviesResponse = await fetch(`${import.meta.env.VITE_API_URL}`);

    const allMovies:bechdelItem[]  = await allMoviesResponse.json();

    const passingList = allMovies.filter(item => item.rating === 3);
    
    // Making sure there is no repetition in the suggestions
    const usedIndices = new Set();
    const maxCount = Math.min(20, allMovies.length);

    while (randomList.length < maxCount) {
      const randomIndex = Math.floor(Math.random() * passingList.length);

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        randomList.push(passingList[randomIndex]);
      }
    }

    const mergedRandomList = await Promise.all(
      randomList.map(async (item: bechdelItem) => {
        const { imageUrl, title } = await fetchPosterAndTitle(item, key);

        return {
          ...item,
          title: title,
          imageUrl: imageUrl,
          link: `https://www.imdb.com/title/tt${item.imdbid}`
        };
      }));
    return mergedRandomList;

  } catch (error) {
    console.error("Error getting random array:", error);
    throw error;
  }
};
