export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'mechanic';
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  duration: number;
}

export interface WaterCraft {
  id: string;
  model: string;
  brand: string;
  year: number;
  category: string;
  serialNumber: string;
}

export interface Reception {
  id: string;
  clientId: string;
  waterCraftId: string;
  status: string;
  description: string;
  createdAt: Date;
  assignedMechanicId?: string;
}

export interface Quote {
  id: string;
  clientId: string;
  items: QuoteItem[];
  status: string;
  total: number;
  currency: string;
  createdAt: Date;
  validUntil: Date;
}

export interface QuoteItem {
  id: string;
  type: 'product' | 'service';
  itemId: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  quoteId?: string;
  clientId: string;
  items: SaleItem[];
  total: number;
  currency: string;
  paymentMethod: string;
  createdAt: Date;
}

export interface SaleItem {
  id: string;
  type: 'product' | 'service' | 'watercraft';
  itemId: string;
  quantity: number;
  price: number;
}

export interface Mechanic {
  id: string;
  userId: string;
  specialties: string[];
  available: boolean;
}