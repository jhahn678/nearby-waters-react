import React, { useEffect } from 'react'
import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { MapProvider } from 'react-map-gl';
import ErrorModal from './components/modals/ErrorModal/ErrorModal';
import ModalContextProvider from './hooks/contexts/modal/ModalContextProvider';
import { useAuth } from './hooks/zustand/useAuth';

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

    const { autoSignIn } = useAuth()

    useEffect(() => {
      const token = localStorage.getItem('AUTH_TOKEN')
      const username = localStorage.getItem('USERNAME')
      if(token && username){
        autoSignIn({ token, username })
      }
    },[])

    return (
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS
          theme={{
            primaryShade: 2,
            colors: {
              grayblue: ["#F0F4F5", "#D4E1E3", "#B8CED0", "#9DBBBE", "#81A7AC", "#65949A", "#51767B", "#3D595C", "#293B3D", "#141E1F"],
              lightblue: ["#EEF3F6","#D1DEE6","#B3C8D6","#95B3C6","#779EB6","#5988A6","#476D85","#355264","#243642","#121B21"]
            }
          }}
        >
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
