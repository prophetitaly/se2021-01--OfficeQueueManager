import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import MyContainer from "./components/MyContainer";

function App() {
  return (
    <Router>
      <MyContainer />
    </Router>
  );
}

export default App;
