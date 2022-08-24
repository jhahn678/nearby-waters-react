import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DemoPage from './pages/DemoPage/DemoPage'
import AuthPage from './pages/AuthPage/AuthPage'
import EditPage from "./pages/EditPage/EditPage";
import AboutPage from "./pages/AboutPage/AboutPage";


const AppRoutes = (): JSX.Element => {
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<DemoPage/>}/>
            <Route path='/demo' element={<DemoPage/>}/>
            <Route path='/about' element={<AboutPage/>}/>
            <Route path='/login' element={<AuthPage/>}/>
            <Route path='/explore' element={<EditPage/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;