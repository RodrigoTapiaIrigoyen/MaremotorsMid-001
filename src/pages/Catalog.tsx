import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Wrench,
  Bike,
  Users,
  UserCog,
  DollarSign,
  Tags,
  ClipboardList,
} from 'lucide-react';

interface CategoryCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  path: string;
}

export default function Catalog() {
  const navigate = useNavigate();
  
  const categories: CategoryCard[] = [
    {
      id: 'products',
      title: 'Productos',
      description: 'Gestión del inventario de productos y repuestos',
      icon: Package,
      color: 'blue',
      path: '/catalog/products'
    },
    {
      id: 'services',
      title: 'Servicios',
      description: 'Administración de servicios de mantenimiento y reparación',
      icon: Wrench,
      color: 'green',
      path: '/catalog/services'
    },
    {
      id: 'units',
      title: 'Unidades',
      description: 'Registro y control de motos acuáticas',
      icon: Bike,
      color: 'purple',
      path: '/catalog/units'
    },
    {
      id: 'clients',
      title: 'Clientes',
      description: 'Base de datos e historial de clientes',
      icon: Users,
      color: 'orange',
      path: '/clients'
    },
    {
      id: 'mechanics',
      title: 'Mecánicos',
      description: 'Gestión de mecánicos y asignación de tareas',
      icon: UserCog,
      color: 'red',
      path: '/mechanics'
    },
    {
      id: 'currencies',
      title: 'Monedas y Tipos de Cambio',
      description: 'Configuración de monedas y tasas de cambio',
      icon: DollarSign,
      color: 'yellow',
      path: '/catalog/currencies'
    },
    {
      id: 'categories',
      title: 'Categorías',
      description: 'Gestión de categorías de productos y servicios',
      icon: Tags,
      color: 'indigo',
      path: '/catalog/categories'
    },
    {
      id: 'status',
      title: 'Estatus',
      description: 'Configuración de estados y flujos de trabajo',
      icon: ClipboardList,
      color: 'pink',
      path: '/catalog/status'
    },
  ];

  const colorVariants = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    pink: 'bg-pink-500 hover:bg-pink-600 text-white',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Catálogo
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Administración centralizada de productos, servicios y configuraciones del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => navigate(category.path)}
                className={`w-full h-full p-6 flex flex-col items-center text-center transition-all duration-300 ${
                  colorVariants[category.color as keyof typeof colorVariants]
                }`}
              >
                <Icon className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <p className="text-sm opacity-90">{category.description}</p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}