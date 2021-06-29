import React, { useContext, useState } from "react";

const LoaderContext = React.createContext();

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const startLoading = () => {
    setIsLoading(true);
  };
  const finishLoading = () => {
    setIsLoading(false);
    setIsModelLoading(false);
  };
  const startLoadingModel = () => {
    setIsModelLoading(true);
    setIsLoading(true);
  };

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        startLoading,
        finishLoading,
        startLoadingModel,
        isModelLoading,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
}
