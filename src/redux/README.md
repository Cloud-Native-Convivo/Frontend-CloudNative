# Redux Store Placeholder

El estado global de autenticación y sesión de la aplicación se gestiona mediante React Context en [`src/context/AuthContext.tsx`](../context/AuthContext.tsx) para mantener el bundle ligero y sin dependencias innecesarias (principio Ponytail / YAGNI).

Esta carpeta `src/redux/` está reservada para la futura integración de `@reduxjs/toolkit` y `react-redux` si la complejidad del estado de la aplicación lo requiere.
