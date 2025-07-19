'use client';

import React from "react";
import { backendService } from "./services/backendService";

function App() {
  React.useEffect(() => {
    console.log(backendService.getAsset('1'));
  }, []);

  return (
    <div>
      <p>hallo world</p>
    </div>
  );
}

export default App;
