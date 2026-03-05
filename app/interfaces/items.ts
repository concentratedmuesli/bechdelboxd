export interface bechdelItem {
  title: string,
  year: number,
  rating: number,
  imdbid: string;
  id: number;
}

export interface omdbAPIResponse {
  Title: string,
  Year: string,
  Rated: string,
  Released: string,
  Runtime: string,
  Genre: string,
  Director: string,
  Writer: string,
  Actors: string,
  Plot: string,
  Language: string,
  Country: string,
  Awards: string,
  Poster: string,
  Ratings: any
}

export interface mergedBechdelItem extends bechdelItem {
  imageUrl: string | null,
  link: string;
}

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

