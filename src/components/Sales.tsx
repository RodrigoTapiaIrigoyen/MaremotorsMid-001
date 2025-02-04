import React, { useState } from 'react';
import axiosInstance from '../axios';

interface SaleData {
  clientId: string;
  productId: string;
  quantity: number;
}

const Sales: React.FC = () => {
  const [clientId, setClientId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>('');

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear una venta en el backend
    const saleData: SaleData = {
      clientId,
      productId,
      quantity,
    };

    try {
      const response = await axiosInstance.post('/sales', saleData);
      setMessage('Venta registrada con éxito!');
      setClientId('');
      setProductId('');
      setQuantity(1);
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      setMessage('Error al registrar la venta');
    }
  };

  return (
    <div>
      <h1>Registrar Venta</h1>
      <form onSubmit={handleSale}>
        <div>
          <label>Cliente</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Producto</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <button type="submit">Registrar Venta</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Sales;
