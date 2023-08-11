import React from 'react';
import {RouterProvider} from "react-router-dom";
import {router} from "./utils/router";
import {FundsContextProvider} from "./contexts/FundsContext";
import {WalletContextProvider} from "./contexts/WalletContext";

function App() {
  return (
      <FundsContextProvider>
        <WalletContextProvider>
          <RouterProvider router={router}></RouterProvider>
        </WalletContextProvider>
      </FundsContextProvider>
  );
}

export default App;
