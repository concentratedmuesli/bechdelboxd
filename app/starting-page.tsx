import horizontalLogo from "/img/horizontal-logo.svg";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


export function EnterUsername() {
  const [letterboxdHandle, setLetterboxdHandle] = useState<string>("");
  let navigate = useNavigate();

  function submitUsername(event: any) {
    event?.preventDefault();

    if (letterboxdHandle.trim()) {
      navigate(`/results/${encodeURIComponent(letterboxdHandle.trim().toLowerCase())}`);
    }
  }

  return (
    <main className="flex items-center justify-center pt-12 sm:pt-16 lg:pb-4 w-[90%] sm:w-[70%] 2xl:w-[50%] 2xl:max-w-640 mx-auto">
      <div className="flex-1 flex flex-col items-center gap-4 lg:gap-12 min-h-0">

        <header>
          <nav>
            <img src={horizontalLogo} />
          </nav>
        </header>

        <div className="flex flex-col gap-4 lg:gap-8 mx-auto max-w-100">
          <div className="">
            <p className="font-fraunces text-white text-2xl 2xl:text-3xl">Of your 50 last watched movies, how many pass the bechdel test?</p>
          </div>
          <div className="">
            <h2 className="font-fraunces text-white text-2xl 2xl:text-3xl">Rules:</h2>
            <ul>
              <li className="pl-6 bg-[url('/public/img/orange-bullet-point.svg')]
                bg-no-repeat bg-position-[-22px_5px] lg:bg-position-[-23px_7px]
                bg-size-[1rem] bg-origin-content">
                have at least two named women in it</li>
              <li className="pl-6 bg-[url('/public/img/green-bullet-point.svg')]
                bg-no-repeat bg-position-[-22px_5px] lg:bg-position-[-23px_7px]
                bg-size-[1rem] bg-origin-content">
                who talk to each other</li>
              <li className="pl-6 bg-[url('/public/img/blue-bullet-point.svg')]
                bg-no-repeat bg-position-[-22px_5px] lg:bg-position-[-23px_7px]
                bg-size-[1rem] bg-origin-content">
                about something other than a man</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <form className="flex flex-col items-start gap-2">
              <label className="font-fraunces text-white text-2xl 2xl:text-3xl">Enter your letterboxd username</label>
              <input type="text" placeholder="username" value={letterboxdHandle}
                onChange={(e) => setLetterboxdHandle(e.target.value)}
                className="rounded-sm border border-gray-500 p-1.5 w-full text-center" />
              <button type="submit" onClick={submitUsername}
                className="bg-bright-green hover:bg-dark-green text-white
              cursor-pointer py-1  text-2xl 2xl:text-3xl font-bold rounded-sm w-full">Find out!</button>
            </form>

            <div>
              <p className='text-base xl:text-lg'>You don't have your own letterboxd account? Check out some popular reviewers' stats:</p>
              <ul>
                <li>
                  <button className='text-base xl:text-lg cursor-pointer
                 text-bright-green underline underline-offset-3
                 hover:text-white active:text-bright-blue'
                    onClick={(e) => setLetterboxdHandle("girlactress")}>
                    girlactress</button>
                </li>
                <li>
                  <button className='text-base xl:text-lg cursor-pointer
                 text-bright-green underline underline-offset-3
                 hover:text-white active:text-bright-blue'
                    onClick={(e) => setLetterboxdHandle("stavvy")}>
                    stavvy</button>
                </li>
                <li>
                  <button className='text-base xl:text-lg cursor-pointer
                 text-bright-green underline underline-offset-3
                 hover:text-white active:text-bright-blue'
                    onClick={(e) => setLetterboxdHandle("itscharlibb")}>
                    itscharlibb</button>
                </li>
                <li>
                  <button className='text-base xl:text-lg cursor-pointer
                 text-bright-green underline underline-offset-3
                 hover:text-white active:text-bright-blue'
                    onClick={(e) => setLetterboxdHandle("scottmescudi84")}>
                    scottmescudi84</button>
                </li>
                <li>
                  <button className='text-base xl:text-lg cursor-pointer
                 text-bright-green underline underline-offset-3
                 hover:text-white active:text-bright-blue'
                    onClick={(e) => setLetterboxdHandle("punkarcana")}>
                    punkarcana</button>
                </li>

              </ul>
              <p className='text-base xl:text-lg pt-2'>Or look for <a href="https://letterboxd.com/members/" rel="noopener noreferrer"
                className="text-bright-green underline underline-offset-3 hover:text-white active:text-bright-blue">other reviewers</a>.
                You will find their username in their profile's URL.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}