import "./App.css";
import { HashRouter } from 'react-router-dom';
import Navigation from "./Nav"
import Router from "./pages/router";

const App = () => {
  return (
    <HashRouter>
      <Navigation />
      <Router />
    </HashRouter>
  );
};

export default App;