import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import type { mergedItem } from "../mergedItems";

interface GraphsComponentProps {
  mergedItems: mergedItem[];
  score0: mergedItem[] ;
  score1: mergedItem[];
  score2: mergedItem[];
  score3: mergedItem[];
  noBechdelData: mergedItem[];
  totalFailing: number | undefined;

}

export function Graphs({ mergedItems, score0, score1, score2, score3, noBechdelData, totalFailing }: GraphsComponentProps) {
  
  const [chartData, setChartData] = useState<any>(null);

  console.log(score0);


  useEffect(() => {

      ChartJS.register(ArcElement, Tooltip, Legend);

      const data = {
        labels: ['Pass', "Fail"],
        datasets: [
          {
            data:
              [score3.length, [score0.length, score1.length, score2.length].reduce((a, b) => a + b)],
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
      
      setChartData(data);
      console.log(data.datasets[0].data);
      
  }, [mergedItems, score0, score1, score2, score3, noBechdelData, totalFailing]);

  if (!chartData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Doughnut data={chartData} className='max-w-60 max-h-60' />
      <p>Only {totalFailing}% of your movies pass the test.</p>
    </div>
  );

}