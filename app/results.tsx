import { useState, useEffect } from 'react';
import { Graphs } from './graphs';
import { Lists } from './lists';
import { getResultData } from './utils/resultFetcher';
import type { sortedItem } from './+types/sortedItems';
import { useParams } from 'react-router';

export default function ShowResults() {
  const { letterboxdHandle } = useParams<{ letterboxdHandle: string; }>();

  const [sortedItems, setSortedItems] = useState<sortedItem[]>([]);

  const [passingPercentage, setpassingPercentage] = useState<number>();


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (letterboxdHandle) {
          const { sortedItems, passingPercentage } = await getResultData(letterboxdHandle);
          if (sortedItems) {
            setSortedItems(sortedItems);
          }
          if (passingPercentage) {
            setpassingPercentage(passingPercentage);
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
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">

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

        <div className="flex flex-col gap-4 mx-auto max-w-[50%]">
          <h2 className="font-fraunces text-white text-2xl">Results for <span className='underline underline-offset-2'>{letterboxdHandle}</span></h2>
          <Graphs
            sortedItems={sortedItems}
            passingPercentage={passingPercentage!}
          ></Graphs>
          <Lists
            sortedItems={sortedItems}
          ></Lists>
        </div>

      </div>
    </main>
  );
}
