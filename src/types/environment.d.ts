declare global {
    namespace NodeJS {
      interface ProcessEnv {
        REACT_APP_API_BASE_URL: string;
        REACT_APP_MAPBOX: string
      }
    }
}


export {}