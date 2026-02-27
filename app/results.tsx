import { useState, useEffect } from 'react';
import { Graphs } from './graphs';
import { Lists } from './lists';
import { getResultData } from './utils/resultFetcher';
import type { sortedItem } from './+types/sortedItems';
import { useParams } from 'react-router';

export default function ShowResults() {
  const { letterboxdHandle } = useParams<{ letterboxdHandle: string; }>();

  const [sortedItems, setSortedItems] = useState<sortedItem[]>([]);

  const [totalFailing, setTotalFailing] = useState<number>();


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (letterboxdHandle) {
          const { sortedItems, totalFailing } = await getResultData(letterboxdHandle);
          if (sortedItems) {
            setSortedItems(sortedItems);
          }
          if (totalFailing) {
            setTotalFailing(totalFailing);
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
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">

        <header>
          <nav>
            <h1 className="text-4xl font-pretendard font-bold text-white p-4">Bechdelboxd</h1>
          </nav>
        </header>

        <div className="flex flex-col gap-4 mx-auto max-w-[50%]">
          <h2 className="font-fraunces text-white text-2xl">Results for <span className='underline underline-offset-2'>{letterboxdHandle}</span></h2>
          <Graphs
            sortedItems={sortedItems}
            totalFailing={totalFailing!}
          ></Graphs>
          <Lists
            sortedItems={sortedItems}
          ></Lists>
        </div>

      </div>
    </main>
  );
}
