import { createContext, memo, useContext, useEffect, useState } from 'react';

import scribbles from '@metanotes/scribbles-pack';

import { ScribblesStore } from './scribbles-store';

const ScribblesStoreContext = createContext<ScribblesStore>(
  null as unknown as ScribblesStore
);

export function useStore(): ScribblesStore {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(ScribblesStoreContext)!;
}

function StoreProviderImpl({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [store, setStore] = useState<ScribblesStore>();

  useEffect(() => {
    const mobxStore = new ScribblesStore();
    mobxStore.loadCoreScribbles(scribbles);
    setStore(mobxStore);

    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
      (window as any).__ScribblesStore = mobxStore;
    }
  }, []);

  return (
    <ScribblesStoreContext.Provider value={store as ScribblesStore}>
      {store && children}
    </ScribblesStoreContext.Provider>
  );
}

export const StoreProvider = memo(StoreProviderImpl);
