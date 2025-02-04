import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reception from './pages/Reception';
import Quotes from './pages/Quotes';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Catalog from './pages/Catalog';
import Clients from './pages/Clients';
import Mechanics from './pages/Mechanics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Users from './pages/Users';


// Catalog sub-pages
import Products from './pages/catalog/Products';
import Services from './pages/catalog/Services';
import Units from './pages/catalog/Units';
import Currencies from './pages/catalog/Currencies';
import Categories from './pages/catalog/Categories';
import Status from './pages/catalog/Status';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="reception" element={<Reception />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/products" element={<Products />} />
          <Route path="catalog/services" element={<Services />} />
          <Route path="catalog/units" element={<Units />} />
          <Route path="catalog/currencies" element={<Currencies />} />
          <Route path="catalog/categories" element={<Categories />} />
          <Route path="catalog/status" element={<Status />} />
          <Route path="clients" element={<Clients />} />
          <Route path="mechanics" element={<Mechanics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;