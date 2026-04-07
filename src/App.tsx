import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TeamSelection from "./pages/TeamSelection";
import LiveScores from "./pages/LiveScores";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<TeamSelection />} />
        <Route path="/scores" element={<LiveScores />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
