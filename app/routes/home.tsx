import type { Route } from "./+types/home";
import { EnterUsername } from "../starting-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bechdelboxd" },
    { name: "description", content: "Find out how many of your watched movies pass the Bechdel test!" },
  ];
}

export default function Home() {
  return <EnterUsername />;
}
