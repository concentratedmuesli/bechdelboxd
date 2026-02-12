import type { Route } from "./+types/home";
import { EnterUsername } from "../starting-page/starting-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <EnterUsername />;
}
