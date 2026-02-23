import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

export default function ShowResults() {
  const [items, setItems] = useState<any[]>([]);
  const [mergedItems, setMergedItems] = useState<any[]>([]);
  const [score0, setScore0] = useState<any[]>([]);
  const [score1, setScore1] = useState<any[]>([]);
  const [score2, setScore2] = useState<any[]>([]);
  const [score3, setScore3] = useState<any[]>([]);
  const [noBechdelData, setNoBechdelData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>({});

  const [loading, setLoading] = useState(true);

  const { letterboxdHandle } = useParams<{ letterboxdHandle: string; }>();

  const CORS_PROXY = 'https://corsproxy.io/?';
  const RSS_URL = `https://letterboxd.com/${letterboxdHandle}/rss/`;

  function extractImageFromDescription(description: string | undefined): string | null {
    if (!description) return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(description, 'text/html');
      const img = doc.querySelector('img');
      return img ? img.src : null;
    } catch (error) {
      console.error('Error parsing description:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items: any[] = [];
        const itemElements = xmlDoc.getElementsByTagName('item');

        // the RSS feed shows the 50 latest watched movies,
        // and then movie lists made by other users that the user follows,
        // which is not relevant for this app so I'm leaving them out
        for (let i = 0; i < 50; i++) {
          const item = itemElements[i];
          const description = item.getElementsByTagName('description')[0]?.textContent;
          const title = item.getElementsByTagName('letterboxd:filmTitle')[0]?.textContent;
          const year = item.getElementsByTagName('letterboxd:filmYear')[0]?.textContent;
          const rating = item.getElementsByTagName('letterboxd:memberRating')[0]?.textContent;
          const watchedDate = item.getElementsByTagName('letterboxd:watchedDate')[0]?.textContent;
          const link = item.getElementsByTagName('link')[0]?.textContent;
          const tmdbId = item.getElementsByTagName('tmdb:movieId')[0]?.textContent;
          const imageUrl = extractImageFromDescription(description);

          items.push({
            title: (/^The\s+/i.test(title) ? title.replace(/^The\s+(.+)/i, '$1, The') : title),
            year: parseInt(year),
            rating: rating,
            watchedDate: watchedDate,
            link: link,
            tmdbId: tmdbId,
            imageUrl: imageUrl
          });
        }

        setItems(items);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();

  }, []);

  useEffect(() => {
    const getMatchingBechdelData = async () => {
      const allMovies = await import('./allMovies.json');
      const allMoviesArray = allMovies.default;

      const mergedItems = items.map(item => {
        let matchingBechdelItem = allMoviesArray.find(movie => {
          return movie.year === item.year && movie.title === item.title;
        });

        return {
          ...item,
          bechdelRating: matchingBechdelItem?.rating,
          imdbId: matchingBechdelItem?.imdbid
        };
      });
      setMergedItems(mergedItems);
    };
    getMatchingBechdelData();
  }, [items]);

  useEffect(() => {
    function createGraph() {
      let score0 = mergedItems.filter(item => item.bechdelRating === 0);
      let score1 = mergedItems.filter(item => item.bechdelRating === 1);
      let score2 = mergedItems.filter(item => item.bechdelRating === 2);
      let score3 = mergedItems.filter(item => item.bechdelRating === 3);
      let noBechdelData = mergedItems.filter(item => !item.bechdelRating);

      setScore0(score0);
      setScore1(score1);
      setScore2(score2);
      setScore3(score3);
      setNoBechdelData(noBechdelData);

      ChartJS.register(ArcElement, Tooltip, Legend);

      const data = {
        labels: ['Pass', "Don't pass"],
        datasets: [
          {
            
            data: [score3.length, [score0.length, score1.length, score2.length].reduce((a, b) => a + b)],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);
      console.log(data.datasets[0].data);
    }
    createGraph();

  }, [items, mergedItems]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Doughnut data={chartData} className='max-w-50 max-h-100'/>
      {/* {mergedItems.map((item, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>
            {item.title}
          </h3>
          <p>{item.year}</p>
          <p>Does the movie pass?: {item.bechdelRating}</p>
          <p>Your rating: {item.rating}</p>
          <p>imdbid: {item.imdbId}</p>
        </div>
      ))} */}
    </div>
  );
}
