import { createContext, useContext, useState } from 'react';

const SelectedComponentContext = createContext();

export const SelectedComponentProvider = ({ children }) => {
  const [selectedComponent, setSelectedComponent] = useState({"nav": 0,"menu": 0});

  return (
    <SelectedComponentContext.Provider value={{ 
      selectedComponent, setSelectedComponent,
      }}>
      {children}
    </SelectedComponentContext.Provider>
  );
};

export const useSelectedComponent = () => {
  return useContext(SelectedComponentContext);
};