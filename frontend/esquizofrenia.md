## Patrón arquitectónico aplicado en el frontend

En este proyecto, implementamos un patrón arquitectónico moderno recomendado por Next.js para aplicaciones con App Router y React Server Components. Este patrón se basa en la **separación de responsabilidades** entre componentes de servidor y de cliente, y se puede describir como:

- **Server/Client Boundary Pattern** (Patrón de Frontera Servidor/Cliente)
- **Server-to-Client Prop Passing Pattern** (Patrón de paso de props del servidor al cliente)
- **SSR Data Hydration Pattern** (Patrón de hidratación de datos del SSR al cliente)

### ¿Cómo funciona?
- Los **server components** (por ejemplo, `app/page.tsx` o `app/register/page.tsx`) se encargan de obtener y proteger datos sensibles, como la sesión del usuario, y de controlar la lógica de acceso.
- Los **client components** (por ejemplo, `HomePageContent.tsx` o `RegisterPageContent.tsx`) reciben estos datos como props y se encargan únicamente de la UI y la interactividad, como manejar formularios, leer parámetros de la URL y mostrar notificaciones.

### Ventajas arquitectónicas
- **Seguridad y control:** El servidor decide qué datos se exponen al cliente y protege la lógica sensible.
- **Performance:** Solo se hidrata en el cliente lo necesario, optimizando el rendimiento y la experiencia de usuario.
- **Escalabilidad y mantenibilidad:** La lógica de negocio y la UI están desacopladas, lo que facilita el testing, el mantenimiento y la evolución del sistema.
- **Mejor experiencia de usuario:** El cliente se encarga de la interactividad y el servidor de la lógica y los datos, siguiendo el principio de separación de responsabilidades (SoC).

### Justificación y defensa
Este patrón es el recomendado por Next.js para aplicaciones modernas, ya que permite aprovechar al máximo las capacidades de React Server Components y el rendering híbrido. Además, reduce la superficie de ataque, mejora la performance y hace el código más mantenible y escalable.

**En resumen:**
No tiene un nombre clásico como "MVC" o "MVVM", pero puedes referenciarlo como "Server/Client Boundary Pattern" o "Server-to-Client Prop Passing Pattern". Es la mejor práctica actual para separar la lógica de negocio/seguridad de la UI interactiva en aplicaciones Next.js.

> Referencias:
> - [Server and Client Components – Next.js Docs](https://nextjs.org/docs/getting-started/react-essentials#server-and-client-components)
> - [React Server Components – Official RFC](https://react.dev/reference/rsc)