# Manual del Sistema de Gestión Maremotors

## Descripción General

El sistema de gestión Maremotors es una aplicación web diseñada para administrar y optimizar las operaciones de un negocio de mantenimiento y reparación de motos acuáticas. Este sistema permite gestionar clientes, servicios, inventarios, ventas, cotizaciones, unidades, y más, proporcionando una solución integral y escalable.

---

## Tecnologías Utilizadas

### **Frontend**

- **Framework:** React.js
- **Librerías adicionales:**
  - React Router: Para la gestión de rutas en la aplicación.
  - Axios: Para realizar solicitudes HTTP al backend.
  - Tailwind CSS: Para el diseño y estilos responsivos.
- **Herramienta de Build:** Vite (rápido y eficiente para desarrollo y producción).
- **Lenguaje:** TypeScript (para tipado estático y mayor robustez).
- **Hosting:** El frontend está alojado en **Neubox**, un proveedor confiable de hosting que asegura alta disponibilidad y rendimiento.

### **Backend**

- **Framework:** Express.js (Node.js)
- **Base de Datos:** MongoDB (NoSQL, escalable y flexible).
- **Librerías adicionales:**
  - Mongoose: Para la modelación de datos en MongoDB.
  - Socket.IO: Para comunicación en tiempo real.
  - Body-parser: Para manejar datos JSON en las solicitudes.
  - CORS: Para manejar políticas de acceso entre dominios.
  - Morgan: Para el registro de solicitudes HTTP.

### **Infraestructura**

- **Servidor:** DigitalOcean (para hosting del backend y frontend).
- **Proxy inverso:** Apache o Nginx (dependiendo de la configuración del cliente).
- **Gestión de procesos:** PM2 (para mantener el backend en ejecución y reiniciarlo automáticamente en caso de fallos).

---

## Funcionalidades Principales

### **Gestión de Clientes**

- Registro, edición y eliminación de clientes.
- Visualización de información detallada de cada cliente.

### **Gestión de Servicios**

- Creación y administración de servicios ofrecidos.
- Asignación de precios, categorías y descripciones.

### **Gestión de Inventarios**

- Control de productos y materiales disponibles.
- Actualización de existencias y precios.

### **Gestión de Ventas**

- Registro de ventas realizadas.
- Generación de reportes de ventas.

### **Gestión de Cotizaciones**

- Creación de cotizaciones personalizadas para clientes.
- Envío de cotizaciones por correo electrónico.

### **Gestión de Unidades**

- Registro de motos acuáticas y vehículos relacionados.
- Asignación de unidades a clientes.

### **Gestión de Monedas y Tipos de Cambio**

- Configuración de monedas aceptadas.
- Actualización de tasas de cambio.

### **Reportes**

- Generación de reportes detallados de ventas, inventarios y servicios.
- Exportación de reportes en formatos compatibles.

### **Comunicación en Tiempo Real**

- Uso de Socket.IO para notificaciones en tiempo real.

---

## Robustez y Complejidad del Sistema

### **Robustez**

El sistema está diseñado para ser altamente confiable y seguro:

- **Seguridad:** Uso de autenticación basada en tokens JWT y políticas CORS para proteger las solicitudes.
- **Resiliencia:** PM2 asegura que el backend se mantenga en ejecución incluso en caso de fallos.
- **Mantenimiento:** Código modular y bien estructurado para facilitar actualizaciones y correcciones.

### **Complejidad**

El sistema incluye múltiples módulos interconectados que manejan diferentes aspectos del negocio:

- **Integración Completa:** Todos los módulos (clientes, servicios, inventarios, ventas, etc.) están integrados para trabajar de manera fluida.
- **Escalabilidad Horizontal:** MongoDB permite manejar grandes volúmenes de datos y escalar horizontalmente según las necesidades del cliente.
- **Frontend Reactivo:** El uso de React.js asegura una experiencia de usuario rápida y dinámica.
- **Backend Eficiente:** Express.js es ligero y puede manejar múltiples solicitudes concurrentes.

---

## Requisitos del Sistema

### **Servidor**

- Sistema operativo: Linux (Ubuntu recomendado).
- RAM: Mínimo 2 GB (4 GB recomendado).
- Espacio en disco: Mínimo 20 GB.

### **Cliente**

- Navegador web moderno (Google Chrome, Firefox, Edge).
- Resolución mínima: 1280x720.

---

## Instrucciones de Uso

1. **Acceso al Sistema:**

   - URL: [https://programamaremotors.com.mx](https://programamaremotors.com.mx)
   - Credenciales iniciales proporcionadas por el administrador.

2. **Navegación:**

   - Usa el menú principal para acceder a las diferentes secciones (Clientes, Servicios, Inventarios, etc.).

3. **Gestión de Datos:**

   - Agrega, edita o elimina registros según sea necesario.

4. **Reportes:**
   - Genera reportes desde la sección correspondiente y descárgalos en el formato deseado.

---

## Instalación para Desarrolladores

Si otro programador desea trabajar en este proyecto, debe seguir los siguientes pasos para configurarlo correctamente:

1. **Clonar el repositorio:**

   ```bash
   git clone <URL-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. **Instalar las dependencias:**

   - Para el backend:
     ```bash
     cd backend
     npm install
     ```
   - Para el frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Configurar las variables de entorno:**

   - Crear un archivo `.env` en el directorio del backend con las siguientes variables:
     ```env
     MONGO_URI=<URL-de-la-base-de-datos-MongoDB>
     PORT=<puerto-del-servidor>
     JWT_SECRET=<clave-secreta-para-autenticación>
     ```

4. **Iniciar el proyecto:**

   - Para el backend:
     ```bash
     npm run dev
     ```
   - Para el frontend:
     ```bash
     npm run dev
     ```

5. **Build para producción:**
   - Para el frontend:
     ```bash
     npm run build
     ```
   - Asegúrate de que la carpeta `dist` generada esté correctamente configurada.

---

## Contacto y Soporte

Para soporte técnico o consultas, comuníquese con el equipo de desarrollo:

- **Correo:** soporte@maremotors.com
- **Teléfono:** +52 123 456 7890

---

Este manual proporciona una visión completa del sistema Maremotors, destacando su funcionalidad, tecnologías, robustez y escalabilidad. Si necesitas más detalles o ajustes, no dudes en indicarlo.
