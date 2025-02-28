import React from 'react';
import { Tags } from 'lucide-react';

export default function Categories() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Tags className="h-8 w-8 text-indigo-500" />
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            KITS DE PRODUCTOS
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de categorías de productos y servicios
          </p>
        </div>
      </div>
      
      {/* Content will be implemented in next iteration */}
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Contenido de categorías próximamente...</p>
      </div>
    </div>
  );
}