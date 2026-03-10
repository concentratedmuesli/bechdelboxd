import type { bechdelItem, omdbAPIResponse } from '~/interfaces/items';
import type { mergedBechdelItem } from '~/interfaces/items';
import {escape, unescape} from 'html-escaper';


const fetchPosterUrl = async (item: bechdelItem, key:string): Promise<{imageUrl:string, title:string}> => {
  const response = await fetch(`https://www.omdbapi.com/?i=tt${item.imdbid}&apikey=${key}`);
  const data: omdbAPIResponse = await response.json();
  const imageUrl = data.Poster;
  const title = data.Title;
  return {imageUrl, title};
};

export const GetRandomPassingFilms = async (): Promise<mergedBechdelItem[]> => {
  try {
    const key = "7e62aed7";
    const randomList: bechdelItem[] = [];
    const allMovies = await import('../allMovies.json');
    const allMoviesArray = allMovies.default;
    const passingList = allMoviesArray.filter(item => item.rating === 3);
    for (let i = 0; i < 20; i++) {
      randomList.push(passingList[Math.floor(Math.random() * passingList.length)]);
    }
    const mergedRandomList = await Promise.all(
      randomList.map(async (item: bechdelItem) => {
        const {imageUrl, title} = await fetchPosterUrl(item, key);
        // const correctedTitle = unescape(/,\s+The$/i.test(item.title) ? item.title.replace(/^(.+),\s+The$/i, 'The $1') : item.title);
        return {
          ...item,
          title: title,
          imageUrl: imageUrl,
          link: `https://www.imdb.com/title/tt${item.imdbid}`
        };
      }));
      console.log(mergedRandomList)
    return mergedRandomList;

  } catch (error) {
    console.error("Error getting random array:", error);
    throw error;
  }
};
