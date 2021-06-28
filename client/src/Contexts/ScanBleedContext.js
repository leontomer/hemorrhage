import React from "react";
import { ModalProvider } from "./ModalContext";
import { LoaderProvider } from "./LoaderContext";
const ScanBleedContext = React.createContext();

export function ScanBleedProvider({ children }) {
  return (
    <ScanBleedContext.Provider>
      <ModalProvider>
        <LoaderProvider>{children}</LoaderProvider>
      </ModalProvider>
    </ScanBleedContext.Provider>
  );
}
