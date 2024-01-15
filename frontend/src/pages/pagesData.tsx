import { routerType } from "../types/router.types";
import About from "./About";
import Home from "./Home";
import House from "./House";
import Senate from "./Senate";
import VoteDetail from "./VoteDetail";

const pagesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home"
  },
  {
    path: "/house",
    element: <House />,
    title: "house"
  },
  {
    path: "/senate",
    element: <Senate />,
    title: "senate"
  },
  {
    path: "about",
    element: <About />,
    title: "about"
  },
  {
    path: "vote/:id",
    element: <VoteDetail />,
    title: "vote"
  }
];

export default pagesData;