import { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ onProductCreated, productToEdit, currencies }) => {
  const [product, setProduct] = useState({
    name: "",
    partNumber: "",
    price: 0,
    stock: 0,
    minStock: 0,
    section: "",
    subsection: "",
    purchasePrice: 0,
    condition: "new",
    currencyId: "", // Cambia 'currency' a 'currencyId'
    exchangeRate: 1, // Añadir tasa de cambio
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const validateProduct = (product) => {
    if (!product.name) {
      return "El nombre del producto es obligatorio.";
    }
    if (!product.partNumber) {
      return "El número de parte es obligatorio.";
    }
    if (!product.price || product.price <= 0) {
      return "El precio debe ser mayor que cero.";
    }
    if (!product.stock || product.stock < 0) {
      return "El stock debe ser mayor o igual a cero.";
    }
    if (!product.minStock || product.minStock < 0) {
      return "El stock mínimo debe ser mayor o igual a cero.";
    }
    if (!product.section) {
      return "La sección es obligatoria.";
    }
    if (!product.currencyId) { // Cambia 'currency' a 'currencyId'
      return "La moneda es obligatoria.";
    }
    if (!product.exchangeRate || product.exchangeRate <= 0) {
      return "La tasa de cambio debe ser mayor que cero.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateProduct(product);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (product._id) {
        await axios.put(`http://localhost:5000/api/products/${product._id}`, product);
      } else {
        await axios.post("http://localhost:5000/api/products", product);
      }
      onProductCreated();
      setProduct({
        name: "",
        partNumber: "",
        price: 0,
        stock: 0,
        minStock: 0,
        section: "",
        subsection: "",
        purchasePrice: 0,
        condition: "new",
        currencyId: "", // Cambia 'currency' a 'currencyId'
        exchangeRate: 1, // Añadir tasa de cambio
      });
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Error saving product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-2">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">No. Parte</label>
        <input
          type="text"
          name="partNumber"
          value={product.partNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Precio</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Stock</label>
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Stock Mínimo</label>
        <input
          type="number"
          name="minStock"
          value={product.minStock}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Sección</label>
        <select
          name="section"
          value={product.section}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Seleccionar Sección</option>
          <option value="A">MOTOR</option>
          <option value="B">ELECTRICO</option>
          <option value="C">COMPONENTES DE ESCAPE</option>
          <option value="D">CABLES</option>
          <option value="E">TURBINA</option>
          <option value="F">GASOLINA</option>
          <option value="G">REMOLQUE</option>
          <option value="H">ACCESORIOS</option>
          <option value="I">CONDUCION</option>
          <option value="J">INTERCOOLER</option>
          <option value="K">CASCO</option>
          <option value="L">ACEITE</option>
          <option value="M">FILTROS</option>
          <option value="N">BUJIAS</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Subsección</label>
        <input
          type="text"
          name="subsection"
          value={product.subsection}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Precio de Compra</label>
        <input
          type="number"
          name="purchasePrice"
          value={product.purchasePrice}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Condición</label>
        <select
          name="condition"
          value={product.condition}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="new">Nuevo</option>
          <option value="used">Usado</option>
          <option value="refurbished">Reacondicionado</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Moneda</label>
        <select
          name="currencyId" // Cambia 'currency' a 'currencyId'
          value={product.currencyId} // Cambia 'currency' a 'currencyId'
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Seleccionar Moneda</option>
          {currencies.map((currency) => (
            <option key={currency._id} value={currency._id}>
              {currency.name} ({currency.symbol})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Tasa de Cambio</label>
        <input
          type="number"
          name="exchangeRate"
          value={product.exchangeRate}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductForm;