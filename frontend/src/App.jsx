import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SalesOrderPage from "./pages/SalesOrderPage";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders/new" element={<SalesOrderPage />} />
        <Route path="/orders/:id" element={<SalesOrderPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

