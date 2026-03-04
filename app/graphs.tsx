import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import type { sortedItem } from "./interfaces/items";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraphsComponentProps {
  sortedItems: sortedItem[];
  passingPercentage: number;
  overallBechdelStats: number[];
  bechdelPassingPercentage: number;
}

export function Graphs({ sortedItems, passingPercentage, overallBechdelStats, bechdelPassingPercentage }: GraphsComponentProps) {

  const [passFailData, setpassFailData] = useState<any>(null);
  const [bechdelPassFailData, setBechdelPassFailData] = useState<any>(null);
  const [variousFailData, setVariousFailData] = useState<any>(null);
  const [missingBechdelData, setMissingBechdelData] = useState<any>(null);



  useEffect(() => {

    const passFailData = {
      labels: ['Pass', "Fail"],
      datasets: [
        {
          data:
            [sortedItems[3].data.length, [sortedItems[0].data.length, sortedItems[1].data.length, sortedItems[2].data.length].reduce((a, b) => a + b)],
          backgroundColor: [
            'rgba(0, 172, 28, 0.2)',
            'rgba(64, 188, 244, 0.2)',

          ],
          borderColor: [
            'rgba(0, 172, 28, 1)',
            'rgba(64, 188, 244, 1)'
          ],
          borderWidth: 5,
          offset: 10,
          hoverOffset: 0,
          borderAlign: 'inner',
          cutout: '20%',
          radius: '85%',
          hoverBorderWidth: 5
        },
      ],
    };

    const bechdelPassFailData = {
      labels: ['Pass', "Fail"],
      datasets: [
        {
          data: overallBechdelStats,
          backgroundColor: [
            'rgba(255, 153, 51, 0.2)',
            'rgba(64, 188, 244, 0.2)',

          ],
          borderColor: [
            'rgba(255, 153, 51, 1)',
            'rgba(64, 188, 244, 1)'
          ],
          borderWidth: 5,
          offset: 10,
          hoverOffset: 0,
          borderAlign: 'inner',
          cutout: '20%',
          radius: '85%',
          hoverBorderWidth: 5
        },
      ],
    };

    const variousFailData = {
      labels: ['No two women', "They don't talk to each other", "They only talk about a man"],
      datasets: [
        {
          data:
            [sortedItems[0].data.length, sortedItems[1].data.length, sortedItems[2].data.length],
          backgroundColor: [
            'rgba(255, 153, 51, 0.2)',
            'rgba(64, 188, 244, 0.2)',
            'rgba(0, 172, 28, 0.2)'
          ],
          borderColor: [
            'rgba(255, 153, 51, 1)',
            'rgba(64, 188, 244, 1)',
            'rgba(0, 172, 28, 1)'
          ],
          borderWidth: 5,
          offset: 10,
          hoverOffset: 0,
          borderAlign: 'inner',
          cutout: '20%',
          radius: '85%',
          hoverBorderWidth: 5
        },
      ],
    };

    const missingBechdelData = {
      labels: ['Match with the bechdel database', "No match with the bechdel database"],
      datasets: [
        {
          data:
            [[sortedItems[0].data.length, sortedItems[1].data.length, sortedItems[2].data.length, sortedItems[3].data.length].reduce((a, b) => a + b), sortedItems[4].data.length],
          backgroundColor: [
            'rgba(0, 172, 28, 0.2)',
            'rgba(153, 170, 187, 0.2)'
            ,

          ],
          borderColor: [
            'rgba(0, 172, 28, 1)',
            'rgba(153, 170, 187, 1)'

          ],
          borderWidth: 5,
          offset: 10,
          hoverOffset: 0,
          borderAlign: 'inner',
          cutout: '20%',
          radius: '85%',
          hoverBorderWidth: 5
        },
      ],
    };

    setpassFailData(passFailData);
    setBechdelPassFailData(bechdelPassFailData);
    setVariousFailData(variousFailData);
    setMissingBechdelData(missingBechdelData);

  }, [sortedItems, passingPercentage]);

  if (!passFailData || !overallBechdelStats || !variousFailData || !missingBechdelData || !bechdelPassingPercentage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 wrap mb-8">
      <div className=" rounded-xl bg-linear-to-br from-bright-green via-bright-blue to-bright-orange p-px">
        <div className="bg-background rounded-xl h-full w-full flex flex-row justify-center p-4 gap-4">
          <div className='flex-1 justify-center items-center'>
            <div className='flex-1 justify-center items-center'>
            <Doughnut data={passFailData} className="max-w-100 max-h-100 self-center" />
            </div>
            <p className="text-center">Only {passingPercentage}% of your movies pass the test.</p>
          </div>
          <div className='flex-1 justify-center items-center'>
            <Doughnut data={bechdelPassFailData} className="max-w-60 max-h-60" />
            <p className="text-center">For comparison, {bechdelPassingPercentage}% of all movies recorded in the Bechdel Test Movie List pass the test.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-around wrap gap-4">
        <div className="flex-1 rounded-xl bg-linear-to-bl from-bright-green via-bright-blue to-bright-orange p-px">
          <div className="bg-background rounded-xl h-full w-full flex flex-col justify-around p-4">
            <Doughnut data={variousFailData} className=' max-w-60 max-h-60' />
            <p>Most of your failed movies are not even close to passing the test.</p>
          </div>
        </div>
        <div className="flex-1 border rounded-xl bg-linear-to-tr from-bright-green via-bright-blue to-bright-orange p-px">
          <div className="bg-background rounded-xl h-full w-full flex flex-col justify-around p-4">
            <Doughnut data={missingBechdelData} className=' max-w-55 max-h-55' />
            <p>Many movies you watched have not yet been recorded in the <a href="https://bechdeltest.com/add/" rel="noopener noreferrer"
              className="text-bright-green underline underline-offset-3 hover:text-white active:text-bright-blue">Bechdel Test Movie List</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );

}