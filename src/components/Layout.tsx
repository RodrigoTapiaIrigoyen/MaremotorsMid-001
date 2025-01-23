import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import {
  BarChart3,
  Box,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Recepción', href: '/reception', icon: Home },
  { name: 'Cotizaciones', href: '/quotes', icon: FileText },
  { name: 'Ventas', href: '/sales', icon: ShoppingCart },
  { name: 'Inventario', href: '/inventory', icon: Box },
  { name: 'Catálogo', href: '/catalog', icon: ClipboardList },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Mecánicos', href: '/mechanics', icon: Wrench },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="https://images.unsplash.com/photo-1590492290624-3bfd6efe3c54?w=32&h=32&fit=crop"
                alt="Maremotors"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Maremotors
              </span>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-6">
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? 'bg-gray-50 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon
                        className={cn(
                          location.pathname === item.href
                            ? 'text-blue-600'
                            : 'text-gray-400 group-hover:text-blue-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://images.unsplash.com/photo-1590492290624-3bfd6efe3c54?w=32&h=32&fit=crop"
              alt="Maremotors"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Maremotors
            </span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            location.pathname === item.href
                              ? 'bg-gray-50 text-blue-600'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <Icon
                            className={cn(
                              location.pathname === item.href
                                ? 'text-blue-600'
                                : 'text-gray-400 group-hover:text-blue-600',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="https://images.unsplash.com/photo-1590492290624-3bfd6efe3c54?w=32&h=32&fit=crop"
                alt="Maremotors"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Maremotors
              </span>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}