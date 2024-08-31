import React, { createContext, useContext, useState, useMemo } from 'react';

const ToggleContext = createContext();

export const useToggle = () => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('useToggle must be used within a ToggleProvider');
  }
  return context;
};

export const ToggleProvider = ({ children }) => {
  const [toggleStates, setToggleStates] = useState({});

  const setToggle = (key, value) => {
    setToggleStates(prev => ({ ...prev, [key]: value }));
  };

  const toggle = (key) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const value = useMemo(() => ({
    toggleStates,
    setToggle,
    toggle,
  }), [toggleStates]);

  return (
    <ToggleContext.Provider value={value}>
      {children}
    </ToggleContext.Provider>
  );
};

export default ToggleProvider;