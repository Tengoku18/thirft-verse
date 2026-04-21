import { useCallback, useState } from "react";

export function useRefresh(loadData: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  return { refreshing, onRefresh };
}
