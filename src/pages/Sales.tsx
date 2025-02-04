import { useEffect, useState } from "react";
import { Edit, Trash, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../components/Clients"; // Asegúrate de que la ruta sea correcta

function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Obtener las ventas
  useEffect(() => {
    axiosInstance
      .get("/sales")
      .then((response) => {
        setSales(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error al obtener las ventas");
        setLoading(false);
      });
  }, []);

  // Crear nueva venta
  const onSubmit = (data) => {
    axiosInstance
      .post("/sales", data)
      .then((response) => {
        setSales([...sales, response.data]);
        reset();
      })
      .catch((err) => setError(err.response?.data?.message || "Error al agregar venta"));
  };

  // Eliminar venta
  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      axiosInstance
        .delete(`/sales/${id}`)
        .then(() => {
          setSales(sales.filter((sale) => sale._id !== id));
          alert("Venta eliminada");
        })
        .catch((err) => setError(err.response?.data?.message || "Error al eliminar la venta"));
    }
  };

  // Editar venta
  const handleEdit = (id) => {
    const newQuantity = prompt("Ingresa la nueva cantidad:");
    if (newQuantity && !isNaN(newQuantity)) {
      axiosInstance
        .put(`/sales/${id}`, { quantity: newQuantity })
        .then(() => {
          setSales(sales.map((sale) => (sale._id === id ? { ...sale, quantity: newQuantity } : sale)));
          alert("Venta actualizada");
        })
        .catch((err) => setError(err.response?.data?.message || "Error al actualizar la venta"));
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando ventas...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📊 Historial de Ventas</h1>

      {/* Formulario para agregar ventas */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">➕ Agregar Venta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            {...register("product", { required: true })}
            className="border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
            placeholder="Producto"
          />
          <input
            {...register("quantity", { required: true })}
            type="number"
            className="border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
            placeholder="Cantidad"
          />
          <input
            {...register("totalPrice", { required: true })}
            type="number"
            className="border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
            placeholder="Precio Total"
          />
        </div>
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-green-600 transition">
          <Plus size={18} /> Agregar Venta
        </button>
      </form>

      {/* Lista de ventas */}
      {sales.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <div key={sale._id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700">🛒 {sale.product || "Producto Desconocido"}</h2>
                <p className="text-gray-500">
                  📦 Cantidad: <span className="font-semibold">{sale.quantity}</span>
                </p>
                <p className="text-gray-500">
                  💰 Precio Total: <span className="font-semibold">${sale.totalPrice}</span>
                </p>
                <p className="text-gray-500">
                  📅 Fecha:{" "}
                  {new Date(sale.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                  onClick={() => handleEdit(sale._id)}
                >
                  <Edit size={18} /> Editar
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                  onClick={() => handleDelete(sale._id)}
                >
                  <Trash size={18} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay ventas disponibles</p>
      )}
    </div>
  );
}

export default Sales;
