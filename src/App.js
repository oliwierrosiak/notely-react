import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "./components/board/boardMain/board";
import Home from "./components/home/home";

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/note/:id" element={<Board />}/>
      </Routes>
   </Router>
  );
}

export default App;
