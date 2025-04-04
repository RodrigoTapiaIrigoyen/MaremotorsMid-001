import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from '../utils/api';

const InventoryForm = ({ onInventoryUpdated, inventoryItemToEdit }) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      productId: "",
      section: "",
      subsection: "",
    },
  });

  const [products, setProducts] = useState([]);
  const [dynamicSections, setDynamicSections] = useState([]); // Estado para las secciones dinámicas

  useEffect(() => {
    // Obtener todos los productos para el selector
    api
      .get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => console.error("Error al obtener los productos:", err));
  }, []);

  useEffect(() => {
    // Obtener las secciones dinámicas desde el backend
    api
      .get("/catalog/sections")
      .then((response) => {
        const sections = response.data.map((section) => section.name); // Extraer nombres de las secciones
        setDynamicSections(sections); // Guardar las secciones dinámicas
      })
      .catch((err) => console.error("Error al obtener las secciones:", err));
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
      api
        .put(`/inventory/${inventoryItemToEdit._id}`, data)
        .then(() => {
          onInventoryUpdated();
          reset();
        })
        .catch((err) => console.error("Error al actualizar el inventario:", err));
    } else {
      // Crear nuevo elemento de inventario
      api
        .post("/inventory", data)
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
         
          {/* Opciones dinámicas */}
          {dynamicSections.map((section, index) => (
            <option key={`dynamic-${index}`} value={section}>
              {section}
            </option>
          ))}
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