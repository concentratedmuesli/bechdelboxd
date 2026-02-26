import { useState, useEffect } from 'react';
import { Graphs } from './graphs';
import { Lists } from './lists';
import { getResultData } from './utils/resultFetcher';
import type { mergedItem } from '../mergedItems';
import { useParams } from 'react-router';

export default function ShowResults() {
  const { letterboxdHandle } = useParams<{ letterboxdHandle: string; }>();

  const [mergedItems, setMergedItems] = useState<mergedItem[]>([]);
  const [score0, setScore0] = useState<mergedItem[]>([]);
  const [score1, setScore1] = useState<mergedItem[]>([]);
  const [score2, setScore2] = useState<mergedItem[]>([]);
  const [score3, setScore3] = useState<mergedItem[]>([]);
  const [noBechdelData, setNoBechdelData] = useState<any[]>([]);
  const [totalFailing, setTotalFailing] = useState<number>();


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (letterboxdHandle) {
          const mergedItems: mergedItem[] = await getResultData(letterboxdHandle);
          setMergedItems(mergedItems);
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
    function divideByScore() {

      let score0 = mergedItems.filter(item => item.bechdelRating === 0);
      let score1 = mergedItems.filter(item => item.bechdelRating === 1);
      let score2 = mergedItems.filter(item => item.bechdelRating === 2);
      let score3 = mergedItems.filter(item => item.bechdelRating === 3);
      let noBechdelData = mergedItems.filter(item => !item.bechdelRating);

      let totalFailing: number | undefined = Math.round((score3.length) * 100 / (score0.length + score1.length + score2.length + score3.length));

      setScore0(score0);
      setScore1(score1);
      setScore2(score2);
      setScore3(score3);
      setNoBechdelData(noBechdelData);

      setTotalFailing(totalFailing);
   
    }
    divideByScore();

  }, [letterboxdHandle, mergedItems]);

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

        <div className="flex flex-col gap-4 mx-auto min-w-[50%]">
          <h2 className="font-fraunces text-white text-2xl">Results for {letterboxdHandle}</h2>
          <Graphs
            mergedItems={mergedItems}
            score0={score0}
            score1={score1}
            score2={score2}
            score3={score3}
            noBechdelData={noBechdelData}
            totalFailing={totalFailing}
          ></Graphs>
          <Lists
            score0={score0}
            score1={score1}
            score2={score2}
            score3={score3}
            noBechdelData={noBechdelData}
            totalFailing={totalFailing}
          ></Lists>
        </div>
        
      </div>
    </main>
  );
}
