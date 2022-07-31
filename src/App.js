import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';

const queryClient = new QueryClient()

function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppRoutes/>
        </MantineProvider>
      </QueryClientProvider>
    )
}

export default App;
