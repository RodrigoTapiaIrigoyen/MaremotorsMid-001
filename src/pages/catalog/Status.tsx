import React from 'react';
import { ClipboardList } from 'lucide-react';

export default function Status() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <ClipboardList className="h-8 w-8 text-pink-500" />
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Estatus
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configuración de estados y flujos de trabajo
          </p>
        </div>
      </div>
      
      {/* Content will be implemented in next iteration */}
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Contenido de estatus próximamente...</p>
      </div>
    </div>
  );
}