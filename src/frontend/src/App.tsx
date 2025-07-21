import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Assets from "./screens/Assets";
import Markeatplace from "./screens/Marketplace";
import Markeatasset from "./screens/Marketassets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} index />
        <Route path="/assets" element={<Assets />} />
        <Route path="/marketplace" element={<Markeatplace />} />
        <Route path="/marketplace/:id" element={<Markeatasset />} />
      </Routes>
    </Router>
  );
}

export default App;
