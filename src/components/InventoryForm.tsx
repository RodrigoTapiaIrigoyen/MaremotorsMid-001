import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const InventoryForm = ({ onInventoryUpdated, inventoryItemToEdit }) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      productId: "",
      section: "",
      subsection: "",
    },
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Obtener todos los productos para el selector
    axios.get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => console.error("Error al obtener los productos:", err));
  }, []);

  useEffect(() => {
    if (inventoryItemToEdit) {
      setValue("productId", inventoryItemToEdit._id);
      setValue("section", inventoryItemToEdit.section);
      setValue("subsection", inventoryItemToEdit.subsection);
    }
  }, [inventoryItemToEdit, setValue]);

  const onSubmit = (data) => {
    if (inventoryItemToEdit) {
      // Actualizar elemento de inventario existente
      axios
        .put(`http://localhost:5000/api/inventory/${inventoryItemToEdit._id}`, data)
        .then(() => {
          onInventoryUpdated();
          reset();
        })
        .catch((err) => console.error("Error al actualizar el inventario:", err));
    } else {
      // Crear nuevo elemento de inventario
      axios
        .post("http://localhost:5000/api/inventory", data)
        .then(() => {
          onInventoryUpdated();
          reset();
        })
        .catch((err) => console.error("Error al crear el inventario:", err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-gray-700">Producto</label>
        <select {...register("productId", { required: true })} className="border p-2 w-full rounded">
          <option value="">Seleccionar Producto</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Sección</label>
        <select {...register("section", { required: true })} className="border p-2 w-full rounded">
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
      <div>
        <label className="block text-gray-700">Subsección</label>
        <input
          {...register("subsection", { required: true })}
          placeholder="Subsección (e.g., A1, B2)"
          className="border p-2 w-full rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        {inventoryItemToEdit ? "Actualizar Inventario" : "Crear Inventario"}
      </button>
    </form>
  );
};

export default InventoryForm;