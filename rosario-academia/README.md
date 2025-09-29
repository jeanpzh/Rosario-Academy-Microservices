# Rosario Academia

## Descripción del Proyecto

Rosario Academia es una plataforma web desarrollada con Next.js, diseñada para la gestión y el acceso a información relevante para deportistas, auxiliares administrativos y administradores de una academia deportiva.  Proporciona funcionalidades de registro, inicio de sesión, gestión de perfiles, control de pagos, visualización de horarios y mucho más.

## Características Principales

*   **Autenticación:**
    *   Registro de usuarios (deportistas) con validación de datos y confirmación por correo electrónico.
    *   Inicio de sesión seguro con gestión de roles (administrador, auxiliar administrativo, deportista).
    *   Recuperación de contraseña.
    *   Cierre de sesión.
*   **Paneles de Control Diferenciados:**
    *   **Administrador:** Gestión completa de deportistas y auxiliares, control de niveles, estado de matrículas y visualización de estadísticas.
    *   **Auxiliar Administrativo:** Gestión de deportistas y pagos.
    *   **Deportista:** Acceso al perfil personal, visualización de horarios, estado de pagos y carnet digital.
*   **Gestión de Perfiles:**
    *   Edición de perfiles de usuario con restricciones de actualización.
    *   Subida y modificación de foto de perfil.
*   **Control de Pagos:**
    *   Visualización del estado de la mensualidad.
    *   Historial de pagos.
    *   Integración con Mercado Pago para pagos online.
*   **Horarios:**
    *   Visualización de horarios semanales.
*   **Carnet Digital:**
    *   Generación de carnet digital con código QR para verificación de matrícula.
*   **Anuncios y Eventos:**
    *   Visualización de anuncios importantes y próximos eventos.
*   **Diseño Responsivo:**
    *   Interfaz de usuario adaptable a diferentes dispositivos.
*	**Tema Oscuro/Claro**
	*	Soporte para tema oscuro y claro, permitiendo a los usuarios elegir su preferencia.

## Tecnologías Utilizadas

*   **Framework:** Next.js
*   **Lenguajes:** TypeScript, JavaScript
*   **Estilos:** Tailwind CSS, globals.css
*   **Componentes UI:** Shadcn/ui
*   **Formularios:** React Hook Form, Zod
*   **Gestión de Estado:** Zustand, React Query
*   **Autenticación y Base de Datos:** Supabase
*   **Imágenes:** Cloudinary
*   **Pagos:** Mercado Pago
*   **Animaciones:** Framer Motion
*	**Tipografía:** Geist

## Requisitos Previos

*   Node.js (versión >= 18)
*   npm o yarn o pnpm o bun
*   Cuenta de Supabase
*   Cuenta de Cloudinary
*   Cuenta de Mercado Pago (con credenciales)
*   API KEY de Resend (opcional, para envio de correo al registrar auxiliar administrativo)

## Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone [URL del repositorio]
    cd jeanpzh-rosario-academia
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    # o
    bun install
    ```

3.  **Configura las variables de entorno:**

    Crea un archivo `.env.local` en la raíz del proyecto y define las siguientes variables (reemplaza los valores de ejemplo con tus propias credenciales):

    ```
    NEXT_PUBLIC_SUPABASE_URL=[URL de tu proyecto Supabase]
    NEXT_PUBLIC_SUPABASE_ANON_KEY=[Clave anónima de Supabase]
    SUPABASE_SERVICE_ROLE_KEY=[Clave de rol de servicio de Supabase]
    CLOUDINARY_CLOUD_NAME=[Nombre de tu cuenta de Cloudinary]
    CLOUDINARY_API_KEY=[Clave API de Cloudinary]
    CLOUDINARY_API_SECRET=[Secreto API de Cloudinary]
    MP_ACCESS_TOKEN=[Token de acceso de Mercado Pago]
    BASE_URL=[URL base de tu aplicación (ej: http://localhost:3000)]
    RESEND_API_KEY=[API KEY de Resend] (opcional)
    ```

4.  **Ejecuta las migraciones de Supabase (opcional, si es necesario):**

    Si la base de datos de Supabase necesita ser actualizada, utiliza la CLI de Supabase para ejecutar las migraciones necesarias.

## Ejecución

1.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    # o
    yarn dev
    # o
    pnpm dev
    # o
    bun dev
    ```

2.  **Abre la aplicación en tu navegador:**

    Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación en funcionamiento.

## Estructura del Directorio

## Notas Adicionales

*   **Autenticación Supabase:** La autenticación está gestionada a través de Supabase.  Asegúrate de configurar correctamente las políticas de seguridad (RLS) en tu base de datos de Supabase para proteger los datos de los usuarios.
*   **Mercado Pago:**  La integración con Mercado Pago permite procesar pagos de forma segura.  Revisa la documentación de Mercado Pago para obtener más información sobre la configuración y las opciones de pago.
*   **Cloudinary:** Cloudinary se utiliza para el almacenamiento y la gestión de imágenes (principalmente avatares de usuario).  Optimiza las imágenes para mejorar el rendimiento de la aplicación.
*   **Componentes UI (Shadcn/ui):** Se utiliza Shadcn/ui para los componentes de la interfaz de usuario. La configuración y las importaciones están definidas en `components.json`.
*	**Gestion de estado con Zustand** La aplicación usa zustand para gestionar el estado global de atleta, si es necesario se puede implementar otras librerías.
