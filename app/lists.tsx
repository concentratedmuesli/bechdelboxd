import type { sortedItem } from "./interfaces/items";

interface ListsComponentProps {
  sortedItems: sortedItem[];
}

export function Lists({ sortedItems }: ListsComponentProps) {

  return (
    <div className="flex flex-col gap-12">

      {/* Fail --------------------------------------------------------------------------------------------------------------------------- */}
      <div>
        <h3 className="font-fraunces text-white text-2xl mb-4">
          Your movies that fail</h3>

        <div className="flex flex-col gap-8">
          {sortedItems.slice(0, 3).map(group => (
            <div key={group.score}>
              <div className='border-b border-light-grey mb-2'>
                <h4 className='uppercase text-sm'>{group.title}</h4>
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                {group.data.length < 1 ?
          <div>There are no movies in this category.</div> :
                group.data.map((item, index) => (
                  <div key={index} className="flex flex-col group relative items-center">
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pass ------------------------------------------------------------------------------------------------------------------------------ */}
      <div>
        <h3 className="font-fraunces text-white text-2xl mb-4">
          Your movies that pass</h3>
        <div className="flex flex-row flex-wrap gap-2">
          {sortedItems[3].data.length < 1 ?
          <div>There are no movies in this category.</div> :
          sortedItems[3].data.map((item, index) => (
            <div key={index} className="flex flex-col group relative items-center">
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
          ))}
        </div>
      </div>

      {/* No rating --------------------------------------------------------------------------------------------------------------------------- */}
      <div>
        <h3 className="font-fraunces text-white text-2xl mb-4">
          Your movies that do not have a Bechdel rating yet</h3>
        <div className="flex flex-row flex-wrap gap-2">
          {sortedItems[4].data.length < 1 ?
          <div>There are no movies in this category.</div> :
          sortedItems[4].data.map((item, index) => (
            <div key={index} className="flex flex-col group relative items-center">
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
          ))}
        </div>
        <p className="py-2">You know whether these movies pass the Bechdel test? Feel free to <a href="https://bechdeltest.com/add/"
        rel="noopener noreferrer" className="text-bright-green underline underline-offset-3 hover:text-white active:text-bright-blue">add them yourself</a> to the Bechdel Test Movie List.</p>
      </div>

    </div>


  );
};