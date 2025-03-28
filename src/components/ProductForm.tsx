import { useState, useEffect } from "react";
import axios from "axios";

interface Currency {
  _id: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

interface Product {
  _id?: string;
  name: string;
  partNumber: string;
  price: number;
  stock: number;
  minStock: number;
  section: string;
  subsection: string;
  purchasePrice: number;
  condition: string;
  currencyId: string;
  exchangeRate: number;
  manufacturer?: string;
}

interface ProductFormProps {
  onProductCreated: () => void;
  productToEdit: Product | null;
  currencies: Currency[];
}

const ProductForm = ({ onProductCreated, productToEdit, currencies }: ProductFormProps) => {
  const [product, setProduct] = useState<Product>({
    name: "",
    partNumber: "",
    price: 0,
    stock: 0,
    minStock: 0,
    section: "",
    subsection: "",
    purchasePrice: 0,
    condition: "new",
    currencyId: "",
    exchangeRate: 1,
    manufacturer: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit && currencies.length > 0) {
      // Buscar la moneda correspondiente al producto que se está editando
      const currency = currencies.find((c) => c._id === productToEdit.currencyId);

      setProduct({
        ...productToEdit,
        section: productToEdit.section || "", // Asegúrate de cargar la sección previa
        currencyId: productToEdit.currencyId || "", // Asegúrate de cargar la moneda previa
        exchangeRate: currency ? currency.exchangeRate : productToEdit.exchangeRate, // Sincronizar tasa de cambio
      });
    } else {
      // Reiniciar el formulario si no hay producto para editar
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
        currencyId: "",
        exchangeRate: 1,
        manufacturer: "",
      });
    }
  }, [productToEdit, currencies]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencyId = e.target.value;
    const selectedCurrency = currencies.find((c) => c._id === currencyId);

    if (selectedCurrency) {
      setProduct({
        ...product,
        currencyId: currencyId,
        exchangeRate: selectedCurrency.exchangeRate
      });
    } else {
      setProduct({
        ...product,
        currencyId: "",
        exchangeRate: 1
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const validateProduct = (product: Product): string | null => {
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
    if (!product.currencyId) {
      return "La moneda es obligatoria.";
    }
    if (!product.exchangeRate || product.exchangeRate <= 0) {
      return "La tasa de cambio debe ser mayor que cero.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        currencyId: "",
        exchangeRate: 1,
        manufacturer: "",
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
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">No. Parte</label>
        <input
          type="text"
          name="partNumber"
          value={product.partNumber}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Precio De Venta</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Stock</label>
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Stock Mínimo</label>
        <input
          type="number"
          name="minStock"
          value={product.minStock}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Sección</label>
        <select
          name="section"
          value={product.section} // Asegúrate de que este valor provenga del estado
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="">Seleccionar Sección</option>
          <option value="Motores">Motores</option>
          <option value="Eléctrico">Eléctrico</option>
          <option value="Componentes de Escape">Componentes de Escape</option>
          <option value="Cables">Cables</option>
          <option value="Turbina">Turbina</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Remolque">Remolque</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Conducción">Conducción</option>
          <option value="Intercooler">Intercooler</option>
          <option value="Casco">Casco</option>
          <option value="Aceite">Aceite</option>
          <option value="Filtros">Filtros</option>
          <option value="Bujías">Bujías</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Subsección</label>
        <input
          type="text"
          name="subsection"
          value={product.subsection}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Precio de Compra</label>
        <input
          type="number"
          name="purchasePrice"
          value={product.purchasePrice}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Condición</label>
        <select
          name="condition"
          value={product.condition}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="new">Nuevo</option>
          <option value="used">Usado</option>
          <option value="refurbished">Reacondicionado</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Moneda</label>
        <select
          name="currencyId"
          value={product.currencyId} // Asegúrate de que este valor provenga del estado
          onChange={handleCurrencyChange}
          className="border p-2 w-full rounded"
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
        <label className="block text-sm font-medium">Fabricante</label>
        <input
          type="text"
          name="manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <input
        type="number"
        name="exchangeRate"
        value={product.exchangeRate}
        readOnly
        hidden // Ocultar el campo de tasa de cambio
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductForm;