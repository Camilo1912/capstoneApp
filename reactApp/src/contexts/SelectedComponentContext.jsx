import { createContext, useContext, useState } from 'react';

const SelectedComponentContext = createContext();

export const SelectedComponentProvider = ({ children }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <SelectedComponentContext.Provider value={{ selectedComponent, setSelectedComponent }}>
      {children}
    </SelectedComponentContext.Provider>
  );
};

export const useSelectedComponent = () => {
  return useContext(SelectedComponentContext);
};