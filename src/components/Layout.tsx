import React, { useState, useEffect } from 'react';
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
  Moon,
  Sun,
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={cn("min-h-screen", darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900")}>
      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="https://images.unsplash.com/photo-1590492290624-3bfd6efe3c54?w=32&h=32&fit=crop"
                alt="Maremotors"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Maremotors
              </span>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
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
                          ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon
                        className={cn(
                          location.pathname === item.href
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400',
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-20 w-auto"
                src="https://servicesmaremotors.com.mx/img/Maremotors.png"
                alt="Maremotors"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Maremotors
              </span>
            </div>
            <button
              type="button"
              className="ml-auto -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setDarkMode(!darkMode)}
            >
              <span className="sr-only">Toggle dark mode</span>
              {darkMode ? <Sun className="h-6 w-6" aria-hidden="true" /> : <Moon className="h-6 w-6" aria-hidden="true" />}
            </button>
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
                              ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <Icon
                            className={cn(
                              location.pathname === item.href
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400',
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
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
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
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Maremotors
              </span>
            </div>
          </div>
          <button
            type="button"
            className="ml-auto -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
            onClick={() => setDarkMode(!darkMode)}
          >
            <span className="sr-only">Toggle dark mode</span>
            {darkMode ? <Sun className="h-6 w-6" aria-hidden="true" /> : <Moon className="h-6 w-6" aria-hidden="true" />}
          </button>
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