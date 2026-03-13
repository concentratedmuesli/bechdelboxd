import type { mergedBechdelItem } from "./interfaces/items";

interface RandomListComponentProps {
  randomFilms: mergedBechdelItem[];
  onRefresh: () => void;
}

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
}

export function RandomList({ randomFilms, onRefresh }: RandomListComponentProps) {
  
const ImageWithFallback = ({ src, fallbackSrc, alt }:ImageWithFallbackProps) => {
  const handleError = (e:React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackSrc;
  };

  return <img src={src} alt={alt} onError={handleError} />;
};


  if (!randomFilms) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col justify-start gap-2 items-start'>
        <h3 className="font-fraunces text-white text-2xl">
          Suggestions of movies which do pass the Bechdel test</h3>
        <button className='text-sm text-tooltip-text bg-dark-grey hover:bg-bright-green hover:text-white
          rounded-sm px-2 py-1 cursor-pointer flex flex-row' onClick={onRefresh}>
          <img src="/img/refresh-button.svg" />
        </button>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        {randomFilms.map((item, index) => (
          <div key={index} className="flex flex-col group relative items-center">
            <a href={`${item.link}`} rel="noopener noreferrer"
              className="w-30 h-45 rounded-sm border border-poster-frame
              hover:outline-2 hover:border-bright-green hover:outline-bright-green
              flex justify-center items-center overflow-hidden">
              <ImageWithFallback
                src={`${item.imageUrl}`}
                alt={`Movie poster of ${item.title}`}
                fallbackSrc="/img/poster-placeholder.svg"
              />
            </a>
            <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs
            font-bold group-hover:scale-100 text-nowrap text-tooltip-text">
              {`${item.title} (${item.year}) `}</span>
            <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span>
          </div>
        ))}
      </div>
    </div>
  );
}