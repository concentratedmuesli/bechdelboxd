import type { sortedItem } from "./interfaces/items";

interface ListsComponentProps {
  sortedItems: sortedItem[];
}

export function Lists({ sortedItems }: ListsComponentProps) {


  return (
    <div className="flex flex-col gap-12">

      {/* Fail --------------------------------------------------------------------------------------------------------------------------- */}
      <div>
        <h3 className="font-fraunces text-white text-2xl 2xl:text-3xl mb-4">
          Your movies that fail</h3>

        <div className="flex flex-col gap-8">
          {sortedItems.slice(0, 3).map(group => (
            <div key={group.score}>
              <div className='border-b border-light-grey mb-2'>
                <h4 className='uppercase text-sm lg:text-base 2xl:text-lg'>{group.title}</h4>
              </div>
              {group.data.length < 1 ?
                <div className="col-span-1"><p>There are no movies in this category.</p></div> :

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2">
                  {group.data.map((item, index) => (
                    <div key={index} className="flex flex-col group relative items-center">
                      <a href={`${item.link}`} rel="noopener noreferrer">
                        <img
                          className='rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green'
                          src={`${item.imageUrl}`}
                          alt={`Movie poster of ${item.title}`}
                        />
                      </a>
                      <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs font-bold group-hover:scale-100 text-nowrap text-tooltip-text">{`${item.title} (${item.year}) `}</span>
                      <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span>
                    </div>
                  ))
                  }
                </div>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Pass ------------------------------------------------------------------------------------------------------------------------------ */}
      <div>
        <h3 className="font-fraunces text-white text-2xl 2xl:text-3xl mb-4">
          Your movies that pass</h3>
        {sortedItems[3].data.length < 1 ?
          <div><p>There are no movies in this category.</p></div> :
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2">

            {sortedItems[3].data.map((item, index) => (
              <div key={index} className="flex flex-col group relative items-center">
                <a href={`${item.link}`} rel="noopener noreferrer" className="">
                  <img
                    className='rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green'
                    src={`${item.imageUrl}`}
                    alt={`Movie poster of ${item.title}`}
                  />
                </a>
                <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs font-bold group-hover:scale-100 text-nowrap text-tooltip-text">{`${item.title} (${item.year}) `}</span>
                <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span>
              </div>
            ))
            }
          </div>
        }
      </div>

      {/* No rating --------------------------------------------------------------------------------------------------------------------------- */}
      <div>
        <h3 className="font-fraunces text-white text-2xl 2xl:text-3xl mb-4">
          Your movies that do not have a Bechdel rating yet</h3>
        {sortedItems[4].data.length < 1 ?
          <div><p>There are no movies in this category.</p></div> :

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2">
            {sortedItems[4].data.map((item, index) => (
              <div key={index} className="flex flex-col group relative items-center">
                <a href={`${item.link}`} rel="noopener noreferrer">
                  <img
                    className='rounded-sm border border-poster-frame hover:outline-2 hover:border-bright-green hover:outline-bright-green'
                    src={`${item.imageUrl}`}
                    alt={`Movie poster of ${item.title}`}
                  />
                </a>
                <span className="absolute -top-10 scale-0 transition-all rounded bg-dark-grey p-2 text-xs font-bold group-hover:scale-100 text-nowrap text-tooltip-text">{`${item.title} (${item.year}) `}</span>
                <span className='absolute -top-4 scale-0 transition-all bg-dark-grey w-3 h-3 rotate-45 group-hover:scale-100'></span>
              </div>
            ))
            }
          </div>
        }
        <p className="py-2">You know whether these movies pass the Bechdel test? Feel free to <a href="https://bechdeltest.com/add/"
          rel="noopener noreferrer" className="text-bright-green underline underline-offset-3 hover:text-white active:text-bright-blue">add them yourself</a> to the Bechdel Test Movie List.</p>
      </div>

    </div>


  );
};