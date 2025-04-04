import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function Dashboard() {
  const [sales, setSales] = useState<{ name: string; sales: number }[]>([]);
  const [stats, setStats] = useState([
    { name: 'Total Sales', value: '$0', change: '0%', icon: Banknote },
    { name: 'New Customers', value: '0', change: '0%', icon: Users },
    { name: 'Pending Quotes', value: '0', change: '0%', icon: ShoppingCart },
    { name: 'Inventory Alerts', value: '0', change: '0%', icon: AlertTriangle },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, quotesResponse, clientsResponse, productsResponse] = await Promise.all([
          api.get('/sales'),
          api.get('/quotes'),
          api.get('/clients'),
          api.get('/products'),
        ]);
  
        const salesData = salesResponse.data;
        const quotesData = quotesResponse.data;
        const clientsData = clientsResponse.data;
        const productsData = productsResponse.data;
  
        // Formatear los datos de ventas para el gráfico
        const formattedSales = salesData.map((sale: any) => ({
          name: sale.product,
          sales: sale.totalPrice,
        }));
  
        // Calcular las métricas
        const totalSalesFromSales = salesData.reduce(
          (acc: number, sale: any) => acc + (sale.totalPrice || 0),
          0
        );
  
        const totalSalesFromQuotes = quotesData
          .filter((quote: any) => quote.status === 'approved')
          .reduce((acc: number, quote: any) => acc + (quote.total || 0), 0);
  
        const totalSales = totalSalesFromSales + totalSalesFromQuotes;
  
        const newCustomers = clientsData.length;
  
        const pendingQuotes = quotesData.filter((quote: any) => quote.status === 'pending').length;
  
        const inventoryAlerts = productsData.filter((product: any) => product.stock < product.minStock).length;
  
        // Actualizar el estado con las métricas calculadas
        setSales(formattedSales);
        setStats([
          { name: 'Total Sales', value: `$${totalSales.toFixed(2)}`, change: '+12.5%', icon: Banknote },
          { name: 'New Customers', value: newCustomers.toString(), change: '+5.2%', icon: Users },
          { name: 'Pending Quotes', value: pendingQuotes.toString(), change: '-2.3%', icon: ShoppingCart },
          { name: 'Inventory Alerts', value: inventoryAlerts.toString(), change: '+0', icon: AlertTriangle },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>

      {/* METRICS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={cn('ml-2 flex items-baseline text-sm font-semibold', stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600')}>
                  {stat.change}
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 self-center" aria-hidden="true" />
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* CHART */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Monthly Sales</h3>
        <div className="mt-2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}