import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Assets from "./screens/Assets";
import Markeatplace from "./screens/Marketplace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} index />
        <Route path="/assets" element={<Assets />} />
        <Route path="/marketplace" element={<Markeatplace />} />
      </Routes>
    </Router>
  );
}

export default App;
