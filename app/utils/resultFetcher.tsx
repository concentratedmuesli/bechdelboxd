import type { mergedItem } from '../interfaces/items';
import type { sortedItem } from '../interfaces/items';
import { unescape } from 'html-escaper';

interface GetResult {
  success: boolean;
  data?: {
  sortedItems: any[], 
  passingPercentage: number,
  overallBechdelStats: number[], 
  bechdelPassingPercentage: number; 
};
  error?: {
    type: 'USER_NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR';
    message: string;
  };
}

export const GetResultData = async (letterboxdHandle: string): Promise<GetResult> => {
  try {
    const CORS_PROXY = 'https://corsproxy.io/?';
    const RSS_URL = `https://letterboxd.com/${letterboxdHandle}/rss/`;

    const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));

    if (response.status === 404) {
      return {
        success: false,
        error: {
          type: 'USER_NOT_FOUND',
          message: 'This letterboxd username does not seem to exist.'
        }
      };
    }

    if (response.status >= 500) {
      return {
        success: false,
        error: {
          type: 'SERVER_ERROR',
          message: 'Letterboxd is currently unavailable.'
        }
      };
    }

    const xmlText = await response.text();

    const allMovies = await import('../allMovies.json');
    const allMoviesArray = allMovies.default;

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
    let limit = itemElements.length > 50 ? 50 : itemElements.length;
    for (let i = 0; i < limit; i++) {
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
        return movie.year === item.year && unescape(movie.title).toLowerCase().replace(/\W/g, '') === (item.title).toLowerCase().replace(/\W/g, '');
      });

      return {
        ...item,
        title: (/,\s+The$/i.test(item.title) ? item.title.replace(/^(.+),\s+The$/i, 'The $1') : item.title),
        bechdelRating: matchingBechdelItem?.rating,
        imdbId: matchingBechdelItem?.imdbid
      };
    });

    const sortedItems: sortedItem[] = [
      {
        score: 0,
        title: "Movies that do not have two named women",
        data: mergedItems.filter(item => item.bechdelRating === 0)
      },
      {
        score: 1,
        title: "Movies that have two named women but who don't talk to each other",
        data: mergedItems.filter(item => item.bechdelRating === 1)
      },
      {
        score: 2,
        title: "Movies that have two named women who talk to each other but only about a man",
        data: mergedItems.filter(item => item.bechdelRating === 2)
      },
      {
        score: 3,
        title: "Movies that pass",
        data: mergedItems.filter(item => item.bechdelRating === 3)
      },
      {
        score: 4,
        title: "Movies with no bedchdel data",
        data: mergedItems.filter(item => item.bechdelRating === undefined)
      },
    ];

    let passingPercentage: number = Math.round((sortedItems[3].data.length) * 100 / (sortedItems[0].data.length + sortedItems[1].data.length + sortedItems[2].data.length + sortedItems[3].data.length));

    let overallBechdelStats: number[] = [allMoviesArray.filter(item => item.rating === 3).length, allMoviesArray.filter(item => item.rating < 3).length];

    let bechdelPassingPercentage: number = Math.round(overallBechdelStats[0] * 100 / allMoviesArray.length);

    return { success: true, data: {sortedItems, passingPercentage, overallBechdelStats, bechdelPassingPercentage}};

  } catch (error) {
    return {
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: 'We seem to be having a network error. Please try again later.'
      }
    };
  }
};
