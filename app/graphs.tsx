import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import type { sortedItem } from "./+types/sortedItems";

interface GraphsComponentProps {
  sortedItems: sortedItem[];
  passingPercentage: number;
}

export function Graphs({ sortedItems, passingPercentage }: GraphsComponentProps) {
  
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {

      ChartJS.register(ArcElement, Tooltip, Legend);

      const data = {
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
      
      setChartData(data);
      
  }, [sortedItems, passingPercentage]);

  if (!chartData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Doughnut data={chartData} className='max-w-60 max-h-60' />
      <p>Only {passingPercentage}% of your movies pass the test.</p>
    </div>
  );

}