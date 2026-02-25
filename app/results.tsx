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
  const [totalFailing, setTotalFailing] = useState<number>();
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

      let totalFailing = Math.round((score3.length) * 100 / (score0.length + score1.length + score2.length + score3.length));

      setScore0(score0);
      setScore1(score1);
      setScore2(score2);
      setScore3(score3);
      setNoBechdelData(noBechdelData);

      setTotalFailing(totalFailing);

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
    }
    createGraph();

  }, [items, mergedItems]);

  if (loading) return <div>Loading...</div>;

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
          <Doughnut data={chartData} className='max-w-60 max-h-60' />
          <p>Only {totalFailing}% of your movies pass the test.</p>
          <h3 className="font-fraunces text-white text-2xl">Your movies that fail</h3>
          <div className='border-b border-light-grey'>
          <h4 className='uppercase text-sm'>Movies that do not have two named women</h4>
          </div>
          <div className="flex flex-row gap-2">
          {score0.map((item, index) => (
            <div key={index}>
              <div className="flex flex-col group relative items-center">
                <a href={`${item.link}`} rel="noopener noreferrer">
                <img
                className='max-w-30 rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green'
                  src={`${item.imageUrl}`}
                  alt={`Movie poster of ${item.title}`}
                  />
                  </a>
                  <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs font-bold group-hover:scale-100 text-nowrap text-tooltip-text">{`${item.title} (${item.year}) `}</span>
                  <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span>
              </div>
            </div>
          ))}
          </div>
          <div className='border-b border-light-grey'>
          <h4 className='uppercase text-sm'>Movies that have two named women but who don't talk to each other</h4>
          </div>
          <div className="flex flex-row gap-2">
          {score1.map((item, index) => (
            <div key={index}>
              <div className="flex flex-col group relative items-center">
                <a href={`${item.link}`} rel="noopener noreferrer">
                <img
                className='max-w-30 rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green'
                  src={`${item.imageUrl}`}
                  alt={`Movie poster of ${item.title}`}
                  />
                  </a>
                  <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs font-bold group-hover:scale-100 text-nowrap text-tooltip-text">{`${item.title} (${item.year}) `}</span>
                  <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </main>
  );
}
