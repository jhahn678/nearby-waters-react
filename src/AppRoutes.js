import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import APIPage from './pages/APIpage'
import TestPage from './pages/TestPage/TestPage.tsx'


const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<HomePage/>}/>
            <Route path='/about' element={<AboutPage/>}/>
            <Route path='/api' element={<APIPage/>}/>
            <Route path='/test' element={<TestPage/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;