import React from 'react';

interface ProductProps {
  name: string;
  stock: number;
  stockMin: number;
}

const ProductCard: React.FC<ProductProps> = ({ name, stock, stockMin }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-lg font-bold">{name}</h2>
      <p>Stock disponible: <strong>{stock}</strong></p>
      
      {stock <= stockMin && (
        <p className="text-red-500 font-bold">⚠ Stock bajo</p>
      )}
    </div>
  );
};

export default ProductCard;
