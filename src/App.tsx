import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ProductsPage from './pages/ProductsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream font-body text-ink">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
