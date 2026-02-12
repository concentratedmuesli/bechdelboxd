import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { useState, useRef } from 'react';
import { useNavigate } from "react-router";
import { ShowResults } from '../results'

export function EnterUsername() {
  
  const usernameRef = useRef<HTMLInputElement>(null);
  const [letterboxdHandle, setLetterboxdHandle] = useState<string>("");

  function submitUsername(event:any){
    // let navigate = useNavigate();
    event.preventDefault();
    if (!usernameRef.current) {
      return;
    } else {
    setLetterboxdHandle(usernameRef.current?.value);
    ShowResults(letterboxdHandle);
  }

  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">
        <header>
          <nav>
            <h1 className="text-4xl font-pretendard font-bold text-white p-4">Bechdelboxd</h1>
          </nav>
        </header>
        <div className="flex flex-col gap-8 mx-auto max-w-100">
          <div className="">
            <p className="font-fraunces text-white text-2xl">Of your 50 last watched movies, how many pass the bechdel test?</p>
          </div>
          <div className="">
            <h2 className="font-fraunces text-white text-2xl">Rules:</h2>
            <p>have at least two named women in it</p>
            <p>who talk to each other</p>
            <p>about something other than a man</p>
          </div>
          <form className="flex flex-col items-start gap-2">
            <label className="font-fraunces text-white text-2xl">Enter your letterboxd username</label>
            <input ref={usernameRef} type="text"
            className="rounded-sm border border-gray-500 p-1 w-full text-center" />
            <button type="submit" onClick={submitUsername} 
            className="bg-bright-green hover:bg-dark-green text-white cursor-pointer py-1  text-2xl font-bold rounded-sm w-full">Find out!</button>
          </form>
        </div>
      </div>
    </main>
  );
}