import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { PopUpProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { HomeScreen } from "./screens/public-screen/Home";
import { AssetMarketPlaceScreen } from "./screens/public-screen/Asset-Marketplace";
import { CourtScreen } from "./screens/public-screen/Court";
import { TreasuryScreen } from "./screens/public-screen/Treasury";
import { CreateAssetScreen } from "./screens/action-screen/CreateAsset";
import { LiquidationScreen } from "./screens/action-screen/Luquidation";
import { TransactionScreen } from "./screens/action-screen/Transaction";
import { VotingScreen } from "./screens/action-screen/Voting";
import { DividendScreen } from "./screens/authenticated-screen/Dividen";
import { DashboardScreen } from "./screens/authenticated-screen/Dashboard";
import { ProfileScreen } from "./screens/authenticated-screen/Profile";

function App() {
  return (
    <AuthProvider>
      <PopUpProvider>
        <ModalProvider>
          <Router>
            <Routes>
              {/* public slash */}
              <Route path="/" element={<HomeScreen />} index />
              <Route path="/market-place" element={<AssetMarketPlaceScreen />} />
              <Route path="/courting" element={<CourtScreen />} />
              <Route path="/treasury" element={<TreasuryScreen />} />
              
              {/* action slash [authenticated page] */}
              <Route path="/action-create" element={<CreateAssetScreen />} />
              <Route path="/action-luquidation" element={<LiquidationScreen />} />
              <Route path="/action-transaction" element={<TransactionScreen />} />
              <Route path="/action-voting" element={<VotingScreen />} />
              
              {/* authentication slash */}
              <Route path="/protected-dividend" element={<DividendScreen />} />
              <Route path="/protected-dashboard" element={<DashboardScreen />} />
              <Route path="/protected-profile" element={<ProfileScreen />} />
            </Routes>
          </Router>
        </ModalProvider>
      </PopUpProvider>
    </AuthProvider>
  );
}

export default App;
