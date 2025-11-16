import React, { createContext, useContext, useMemo, useState } from 'react';

// Global app context (non-auth stuff for now)
// Phase 5 will add AuthContext with token management.
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [appName] = useState('ATF Jets');
  const value = useMemo(() => ({ appName }), [appName]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
