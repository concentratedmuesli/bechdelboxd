export interface mergedItem {
  title: string,
  year: number,
  rating: number,
  watchedDate: string,
  link: string,
  tmdbId: number,
  imageUrl: string;
  bechdelRating: number;
  imdbId: string;
}

export interface sortedItem {
  score: number,
  title: string,
  data: mergedItem[];
}

