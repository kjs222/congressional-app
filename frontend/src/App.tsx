import "./App.css";
import { HashRouter } from 'react-router-dom';
import Router from "./pages/router";

const App = () => {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  );
};

export default App;