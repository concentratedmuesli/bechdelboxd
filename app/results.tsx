import { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import allMovies from './allMovies.json';

type CustomItem = {filmTitle: string, filmYear: string, watchedDate: Date};

const parser: Parser<CustomItem> = new Parser({
  customFields: {
    item: [
      ['letterboxd:filmTitle', 'filmTitle'],
      ['letterboxd:filmYear', 'filmYear'],
      ['letterboxd:watchedDate', 'watchedDate'],
    ],
  },
});

interface rssItem {
  title: string,
  year: number,
  watched: Date
}

interface bechdelItem {
  id: number,
  title: string,
  rating: number,
  year: number,
  imdbid: string
}

const rssList:rssItem[] = [];
const bechdelList:bechdelItem[] = [];

export function ShowResults(letterboxdHandle:string) {


(async () => {
   const feed = await parser.parseURL(
    `https://letterboxd.com/${letterboxdHandle}/rss/`,
  );

  feed.items.forEach((item) => {
    let title = item.filmTitle;
    if (/^The\s+/i.test(title)) {
      title = title.replace(/^The\s+(.+)/i, '$1, The');
    }

    let year = parseInt(item.filmYear);
    let watched = item.watchedDate;
    rssList.push({ title: title, year: year, watched: watched });
  });
  console.log('rss list: -----------------------------');
  console.log(rssList);
  console.log('rss list count:');
  console.log(rssList.length);

  rssList.forEach((watchedMovie) => {
    let watchedMovieBechdelInfo;
    [watchedMovieBechdelInfo] = allMovies.filter(
      (movie:bechdelItem) =>
        movie.title === watchedMovie.title &&
        (movie.year === watchedMovie.year ||
          movie.year === (watchedMovie.year + 1) ||
          movie.year === (watchedMovie.year - 1)),
    );
    if (watchedMovieBechdelInfo) {
      bechdelList.push(watchedMovieBechdelInfo);
    }
  });
  console.log('bechdel list: ------------------------');
  console.log(bechdelList);
  console.log('bechdel list count:');
  console.log(bechdelList.length);

  const passingMovies = bechdelList.filter(movie => movie.rating === 3);
  console.log('passed the test:');
  console.log(passingMovies.length);

  const passingPercentage = Math.round(passingMovies.length * 100 / bechdelList.length) + '%';
  console.log(passingPercentage)
})();
}