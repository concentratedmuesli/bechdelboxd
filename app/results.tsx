import { useState, useEffect } from 'react';
import { Graphs } from './graphs';
import { Lists } from './lists';
import { RandomList } from './randomList';
import { GetResultData } from './utils/resultFetcher';
import type { mergedBechdelItem, sortedItem } from './interfaces/items';
import { useParams } from 'react-router';
import { GetRandomPassingFilms } from './utils/passingFilmsSuggester';
import horizontalLogo from '/img/horizontal-logo.svg';
import { useNavigate } from "react-router-dom";
import { Loading } from './loading';

type Error = {
  type: 'USER_NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'NO_LOGGED_FILMS';
  message: string;
} | null;

export default function ShowResults() {
  let navigate = useNavigate();

  const { letterboxdHandle } = useParams<{ letterboxdHandle: string; }>();

  const [sortedItems, setSortedItems] = useState<sortedItem[]>([]);
  const [passingPercentage, setpassingPercentage] = useState<number>();
  const [overallBechdelStats, setOverallBechdelStats] = useState<number[]>();
  const [bechdelPassingPercentage, setBechdelPassingPercentage] = useState<number>();
  const [randomFilms, setRandomFilms] = useState<mergedBechdelItem[]>();

  const [refresh, setRefresh] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (letterboxdHandle) {
          const resultData = await GetResultData(letterboxdHandle);
          if (resultData.success) {
            setSortedItems(resultData.data!.sortedItems);
            setpassingPercentage(resultData.data!.passingPercentage);
            setOverallBechdelStats(resultData.data!.overallBechdelStats);
            setBechdelPassingPercentage(resultData.data!.bechdelPassingPercentage);
            setError(null);
          } else if (resultData.error) {
            setError(resultData.error);
          }
        }
      } catch (error) {
        console.error("Error getting results:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const randomFilms = await GetRandomPassingFilms();
        if (randomFilms) {
          setRandomFilms(randomFilms);
        }
      } catch (error) {
        console.error("Error getting random list:", error);
      }
    };

    fetchRandomMovies();
  }, [refresh]);

  const returnToHomePage = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  if (loading) return <Loading></Loading>;

  if (error) return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen max-w-[90%] sm:w-[70%] 2xl:w-[50%] 2xl:max-w-640 mx-auto'>
      <h1 className="font-fraunces text-white text-3xl 2xl:text-4xl">Oops!</h1>
      <p className='text-center'>{error.message}</p>
      <button className='text-sm xl:text-base text-tooltip-text bg-dark-grey hover:bg-bright-green hover:text-white
          rounded-sm px-2 py-1 cursor-pointer' onClick={returnToHomePage}>
        try again</button>
    </div>);

  return (
    <main className="flex items-center justify-center pt-8 pb-4 max-w-[90%] sm:w-[70%] 2xl:w-[50%] 2xl:max-w-640 mx-auto">
      <div className="flex-1 flex flex-col items-center gap-12 ">

        <header>
          <nav className='flex flex-col sm:flex-row justify-between items-start gap-4 xl:gap-6 2xl:gap-8 w-full'>
            <div className='flex flex-col flex-1'>
              <img src={horizontalLogo} className='max-w-full sm:max-w-70' />
              <p className="">Of your 50 last watched movies, how many pass the bechdel test?</p>
            </div>
            <div className='flex flex-col flex-1'>
              <h2 className="font-fraunces text-white text-2xl ">Rules:</h2>
              <ul>
                <li className="pl-7 bg-[url('/public/img/orange-bullet-point.svg')]
                bg-no-repeat bg-position-[-24px_5px] lg:bg-position-[-24px_7px] bg-size-[1rem] bg-origin-content">
                  have at least two named women in it</li>
                <li className="pl-7 bg-[url('/public/img/green-bullet-point.svg')]
                bg-no-repeat bg-position-[-24px_5px] lg:bg-position-[-24px_7px] bg-size-[1rem] bg-origin-content">
                  who talk to each other</li>
                <li className="pl-7 bg-[url('/public/img/blue-bullet-point.svg')]
                bg-no-repeat bg-position-[-24px_5px] lg:bg-position-[-24px_7px] bg-size-[1rem] bg-origin-content">
                  about something other than a man</li>
              </ul>
            </div>
          </nav>
        </header>

        <div className="flex flex-col gap-4 mx-auto">
          <div className='flex flex-col justify-start gap-2 items-start'>
            <h2 className="font-fraunces text-white text-3xl 2xl:text-4xl">Results for {letterboxdHandle}</h2>
            <button className='text-sm xl:text-base text-tooltip-text bg-dark-grey hover:bg-bright-green hover:text-white
          rounded-sm px-2 py-1 cursor-pointer' onClick={returnToHomePage}>
              enter another user</button>
          </div>
          <Graphs
            sortedItems={sortedItems}
            passingPercentage={passingPercentage!}
            overallBechdelStats={overallBechdelStats!}
            bechdelPassingPercentage={bechdelPassingPercentage!}
          ></Graphs>
          <Lists
            sortedItems={sortedItems}
          ></Lists>
          <RandomList
            randomFilms={randomFilms!}
            onRefresh={handleRefresh}
          ></RandomList>
          <p className='text-sm xl:text-base'>This project is not affiliated to but uses data from the <a href="https://bechdeltest.com/"
            rel="noopener noreferrer" className="text-bright-green underline underline-offset-3 hover:text-white active:text-bright-blue">Bechdel Test Movie List</a>.</p>
        </div>
      </div>
    </main>
  );
}
