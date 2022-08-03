import React from 'react'
import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { MapProvider } from 'react-map-gl';
import ErrorModal from './components/modals/ErrorModal/ErrorModal';
import ModalContextProvider from './hooks/contexts/modal/ModalContextProvider';

const queryClient = new QueryClient({ 
  defaultOptions: { 
    queries: { 
      refetchOnMount: false, 
      refetchOnWindowFocus: false, 
      refetchOnReconnect: false
    } 
  } 
})

const App = (): JSX.Element => {
    return (
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <MapProvider>
            <ModalContextProvider>
              <ErrorModal/>
              <AppRoutes/>
            </ModalContextProvider>
          </MapProvider>
        </MantineProvider>
      </QueryClientProvider>
    )
}

export default App;
