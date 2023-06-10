import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import NiceModal from "@ebay/nice-modal-react";

import "leaflet/dist/leaflet.css";
import "styles/leaflet.css";

import { QueryProvider } from "features/api";

import { App } from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider toastOptions={{ defaultOptions: { position: "top" } }}>
      <QueryProvider>
        <NiceModal.Provider>
          <App />
        </NiceModal.Provider>
      </QueryProvider>
    </ChakraProvider>
  </React.StrictMode>
);
