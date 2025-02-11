import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const ProductForm = ({ onProductCreated, productToEdit }) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      minStock: 0,
      section: "",
      subsection: "",
    },
  });

  useEffect(() => {
    if (productToEdit) {
      setValue("name", productToEdit.name);
      setValue("price", productToEdit.price);
      setValue("stock", productToEdit.stock);
      setValue("minStock", productToEdit.minStock);
      setValue("section", productToEdit.section);
      setValue("subsection", productToEdit.subsection);
    }
  }, [productToEdit, setValue]);

  const onSubmit = (data) => {
    if (productToEdit) {
      // Actualizar producto existente
      axios
        .put(`http://localhost:5000/api/products/${productToEdit._id}`, data)
        .then(() => {
          onProductCreated();
          reset();
        })
        .catch((err) => console.error(err));
    } else {
      // Crear nuevo producto
      axios
        .post("http://localhost:5000/api/products", data)
        .then(() => {
          onProductCreated();
          reset();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <input
        {...register("name", { required: true })}
        placeholder="Nombre del producto"
        className="border p-2 mb-2 w-full"
      />
      <input
        {...register("price", { required: true })}
        type="number"
        placeholder="Precio del producto"
        className="border p-2 mb-2 w-full"
      />
      <input
        {...register("stock", { required: true })}
        type="number"
        placeholder="Stock del producto"
        className="border p-2 mb-2 w-full"
      />
      <input
        {...register("minStock", { required: true })}
        type="number"
        placeholder="Stock mínimo del producto"
        className="border p-2 mb-2 w-full"
      />
      <select
        {...register("section", { required: true })}
        className="border p-2 mb-2 w-full"
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
      <input
        {...register("subsection", { required: true })}
        placeholder="Subsección (e.g., A1, B2)"
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        {productToEdit ? "Actualizar Producto" : "Crear Producto"}
      </button>
    </form>
  );
};

export default ProductForm;