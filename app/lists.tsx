import type { mergedItem } from "../mergedItems";

interface ListsComponentProps {
  score0: mergedItem[];
  score1: mergedItem[];
  score2: mergedItem[];
  score3: mergedItem[];
  noBechdelData: mergedItem[];
  totalFailing: number | undefined;
}

export function Lists ({score0, score1, score2, score3, noBechdelData, totalFailing}: ListsComponentProps) {

  return (
    <div>
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

  );
};