import { useState, useEffect } from 'react';
import { Graphs } from './graphs';
import { Lists } from './lists';
import { getResultData } from './utils/resultFetcher';
import type { sortedItem } from './interfaces/items';
import { useParams } from 'react-router';

export default function ShowResults() {
  const { letterboxdHandle } = useParams<{ letterboxdHandle: string; }>();

  const [sortedItems, setSortedItems] = useState<sortedItem[]>([]);
  const [passingPercentage, setpassingPercentage] = useState<number>();
  const [overallBechdelStats, setOverallBechdelStats] = useState<number[]>();
  const [bechdelPassingPercentage, setBechdelPassingPercentage] = useState<number>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (letterboxdHandle) {
          const { sortedItems, passingPercentage, overallBechdelStats, bechdelPassingPercentage } = await getResultData(letterboxdHandle);
          if (sortedItems) {
            setSortedItems(sortedItems);
          }
          if (passingPercentage) {
            setpassingPercentage(passingPercentage);
          }
          if (overallBechdelStats) {
            setOverallBechdelStats(overallBechdelStats);
          }
          if (bechdelPassingPercentage) {
            setBechdelPassingPercentage(bechdelPassingPercentage);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="flex items-center justify-center pt-8 pb-4 max-w-[50%] mx-auto">
      <div className="flex-1 flex flex-col items-center gap-12 ">

        <header>
          <nav className='flex flex-row justify-between items-start gap-4'>
            <div className='flex flex-col flex-1'>
              <h1 className="text-4xl font-pretendard font-bold text-white">Bechdelboxd</h1>
              <p className="">Of your 50 last watched movies, how many pass the bechdel test?</p>
            </div>
            <div className='flex flex-col flex-1'>
              <h2 className="font-fraunces text-white text-xl ">Rules:</h2>
              <ul>
                <li>have at least two named women in it</li>
                <li>who talk to each other</li>
                <li>about something other than a man</li>
              </ul>
            </div>
          </nav>
        </header>

        <div className="flex flex-col gap-4 mx-auto">
          <h2 className="font-fraunces text-white text-2xl">Results for {letterboxdHandle}</h2>
          <Graphs
            sortedItems={sortedItems}
            passingPercentage={passingPercentage!}
            overallBechdelStats={overallBechdelStats!}
            bechdelPassingPercentage={bechdelPassingPercentage!}
          ></Graphs>
          <Lists
            sortedItems={sortedItems}
          ></Lists>
          <p className='text-sm'>This project is not affiliated to but uses data from the <a href="https://bechdeltest.com/"
            rel="noopener noreferrer" className="text-bright-green underline underline-offset-3 hover:text-white active:text-bright-blue">Bechdel Test Movie List</a>.</p>
        </div>
      </div>
    </main>
  );
}
