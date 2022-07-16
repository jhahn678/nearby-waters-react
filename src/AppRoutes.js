import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ManualPage from './pages/ManualPage'


const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<HomePage/>}/>
            <Route path='/about' element={<AboutPage/>}/>
            <Route path='/manual' element={<ManualPage/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;