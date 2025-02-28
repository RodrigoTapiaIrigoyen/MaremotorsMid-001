import { useState, useEffect } from "react";
import axios from "axios";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Product {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SaleProduct {
  product: Product | null;
  quantity: number;
}

interface Sale {
  _id: string;
  date: string;
  total: number;
  products: SaleProduct[];
  status: string;
  client: Client | string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [error, setError] = useState<string>("");
  const [clientForm, setClientForm] = useState<Client | null>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    // Obtener clientes
    axios.get("http://localhost:5000/api/clients")
      .then((response) => {
        setClients(response.data);
      })
      .catch((err) => console.error("Error al obtener los clientes:", err));
  }, []);

  useEffect(() => {
    if (selectedClient) {
      // Obtener ventas por cliente
      axios.get(`http://localhost:5000/api/sales`)
        .then((response) => {
          const clientSales = response.data.filter((sale: Sale) => {
            if (sale.client && typeof sale.client === 'object' && sale.client._id) {
              return sale.client._id === selectedClient;
            } else if (typeof sale.client === 'string') {
              return sale.client === selectedClient;
            }
            return false;
          });
          setSales(clientSales);
        })
        .catch((err) => console.error("Error al obtener las ventas:", err));
    }
  }, [selectedClient]);

  const handleClientFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientForm((prevForm) => (prevForm ? { ...prevForm, [name]: value } : null));
  };

  const handleClientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientForm) {
      try {
        if (clientForm._id) {
          // Actualizar cliente existente
          await axios.put(`http://localhost:5000/api/clients/${clientForm._id}`, clientForm);
        } else {
          // Crear nuevo cliente
          await axios.post("http://localhost:5000/api/clients", clientForm);
        }
        setClientForm({
          _id: "",
          name: "",
          email: "",
          phone: "",
          address: ""
        });
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data);
      } catch (err) {
        console.error("Error al guardar el cliente:", err);
      }
    }
  };

  const handleEditClient = (client: Client) => {
    setClientForm(client);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${clientId}`);
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error al eliminar el cliente:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Gestión de Clientes</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleClientFormSubmit} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{clientForm?._id ? "Editar Cliente" : "Agregar Cliente"}</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={clientForm?.name || ""}
              onChange={handleClientFormChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={clientForm?.email || ""}
              onChange={handleClientFormChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={clientForm?.phone || ""}
              onChange={handleClientFormChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={clientForm?.address || ""}
              onChange={handleClientFormChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {clientForm?._id ? "Actualizar Cliente" : "Agregar Cliente"}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lista de Clientes</h2>
        <ul className="space-y-4">
          {clients.map((client) => (
            <li key={client._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <span className="block text-lg font-semibold text-gray-800">{client.name}</span>
                <span className="block text-gray-600">{client.email}</span>
                <span className="block text-gray-600">{client.phone}</span>
                <span className="block text-gray-600">{client.address}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClient(client)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClient(client._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setSelectedClient(client._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Ver Historial
                </button>
              </div>
            </li>
          ))}
        </ul>

        {selectedClient && (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-700">Historial de Compras</h2>
            <ul className="space-y-4">
              {sales.map((sale) => (
                <li key={sale._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <span className="block text-lg font-semibold text-gray-800">Venta ID: {sale._id}</span>
                    <span className="block text-gray-600">Fecha: {new Date(sale.date).toLocaleDateString()}</span>
                    <span className="block text-gray-600">Total: ${sale.total ? sale.total.toFixed(2) : '0.00'}</span>
                    <span className="block text-gray-600">Estado: {sale.status}</span>
                    <ul className="mt-2 space-y-1">
                      {sale.products.length > 0 ? (
                        sale.products.map((product, index) => (
                          <li key={index} className="text-gray-600">
                            {product.product ? `${product.product.name} - Cantidad: ${product.quantity}` : "Producto no disponible"}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-600">Sin productos disponibles</li>
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Clients;