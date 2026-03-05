import type { mergedBechdelItem } from "./interfaces/items";

interface RandomListComponentProps {
  randomFilms: mergedBechdelItem[];
}

export function RandomList({ randomFilms }: RandomListComponentProps) {
  return (
    <div>
      <h3 className="font-fraunces text-white text-2xl mb-4">
        Suggestions of movies which do pass the Bechdel test</h3>
      <div className="flex flex-row flex-wrap gap-2">
        {randomFilms.map((item, index) => (
          <div key={index} className="flex  group relative items-center">
            <a href={`${item.link}`} rel="noopener noreferrer"
              className="w-30 h-45 rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green p-2">
              {/* <img
                        className='max-w-30 rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green'
                        src={`${item.imageUrl}`}
                        alt={`Movie poster of ${item.title}`}
                      /> */}
              <p>{item.title}</p>
              <p>{`(${item.year})`}</p>
            </a>
            {/* <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs font-bold group-hover:scale-100 text-nowrap text-tooltip-text">{`${item.title} (${item.year}) `}</span>
            <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span> */}
          </div>
        ))}
      </div>
    </div>
  );
}