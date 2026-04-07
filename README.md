# Bechdelboxd

This app lets you see how many and which of the last 50 movies you've logged on your Letterboxd diary have passed or failed the Bechdel Test.

[View Live Project](https://bechdelboxd.vercel.app/)

## More on Letterboxd and the Bechdel test

- [Letterboxd](https://en.wikipedia.org/wiki/Letterboxd)
- [The Bechdel test](https://en.wikipedia.org/wiki/Bechdel_test)
- [The Bechdel Test Movie List](https://bechdeltest.com/)

## Description

Based on your letterboxd username, the app shows you:

- how many of your last 50 watched movies pass the Bechdel test
- a comparison with the average for all movies recorded by the Bechdel Test Movie List
- among the ones who failed the test, how many failed at each level
- how many of your watched movies are recorded in the Bechdel Test Movie List

- which were your movies that failed at each level
- which passed
- which were not found in the Bechdel Test Movie List and are thus not accounted for

- a suggestion of 20 random movies which do pass the Bechdel test and the possibility to press a refresh button to get a new random list

For users who do not have a letterboxd account or logged any movies in their letterboxd diary, a list of popular letterboxd' users is provided on the landing page, so they can still see the app in action.

## Technologies Used

- **Frontend**: React Router, Typescript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

Backend:

```bash
node --env-file .env --watch App.js
```
