import { createContext, useContext } from "react";

interface AppInitContextType {
  needsUpdate: boolean;
  versionCheckDone: boolean;
}

export const AppInitContext = createContext<AppInitContextType>({
  needsUpdate: false,
  versionCheckDone: false,
});

export function useAppInit() {
  return useContext(AppInitContext);
}
