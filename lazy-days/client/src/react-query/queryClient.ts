import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      staleTime: 1000 * 60 * 10, // 10分株
      cacheTime: 1000 * 60 * 15, // 15分鐘
      refetchOnMount: false, // 組建重新掛載時
      refetchOnReconnect: false, // 網路重新連接時
      refetchOnWindowFocus: false, // 視窗重新focus
      // refetchInterval: 1000, // 輪詢
    },
  },
});
